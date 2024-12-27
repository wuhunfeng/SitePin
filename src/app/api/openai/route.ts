import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';

// 开发环境使用代理
const agent = process.env.NODE_ENV === 'development' 
  ? new HttpsProxyAgent('http://127.0.0.1:7890')
  : undefined;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_URL || "https://generativelanguage.googleapis.com/v1beta/openai",
  httpAgent: agent
});

export async function POST(req: Request) {
  try {
    const { messages, isImageChat } = await req.json();

    // 根据请求类型使用不同的消息格式
    const formattedMessages = isImageChat ? messages : messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    const completion = await openai.chat.completions.create({
      model: isImageChat 
        ? (process.env.OPENAI_IMAGE_MODEL || "gemini-2.0-flash-exp")
        : (process.env.OPENAI_MODEL || "gemini-2.0-flash-exp"),
      messages: formattedMessages,
      stream: true,
    });

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
    
  } catch (error) {
    console.error('Gemini API error:', error);
    return Response.json({ error: 'Failed to call Gemini API' }, { status: 500 });
  }
} 