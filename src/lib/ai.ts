interface ChatOptions {
  stream?: boolean;
  onStream?: (text: string) => void;
  onFinish?: () => void;
}

interface ImageMessage {
  role: string;
  content: Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

class AI {
  private static instance: AI;

  private constructor() {}

  static getInstance() {
    if (!AI.instance) {
      AI.instance = new AI();
    }
    return AI.instance;
  }

  async chat(messages: any[], options: ChatOptions = {}) {
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          isImageChat: messages[0]?.content?.[0]?.type === 'image_url'
        })
      });

      if (!res.ok) throw new Error('API request failed');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let buffer = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer) {
            const line = buffer.trim();
            if (line.startsWith('data: ')) {
              const data = line.slice(5).trim();
              if (data === '[DONE]') {
                console.log('ai done: ', accumulatedText);
                options.onFinish?.();
                return accumulatedText;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                accumulatedText += content;
                options.onStream?.(accumulatedText);
              } catch (e) {
                console.warn('Failed to parse SSE message:', e);
              }
            }
          }
          break;
        }

        // 解码新的数据块
        const chunk = decoder.decode(value, { stream: true });
        
        // 将新数据添加到缓冲区
        buffer += chunk;
        
        // 按行分割并处理
        const lines = buffer.split('\n');
        // 保留最后一个可能不完整的行
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(5).trim();
            
            // 检查是否是结束标记
            if (data === '[DONE]') {
              console.log('ai done: ', accumulatedText);
              options.onFinish?.();
              return accumulatedText;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              accumulatedText += content;
              options.onStream?.(accumulatedText);
            } catch (e) {
              console.warn('Failed to parse SSE message:', e);
            }
          }
        }
      }

      return accumulatedText;
    } catch (err) {
      console.error('AI chat error:', err);
      throw err;
    }
  }

  private async imageToBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error('Image to base64 conversion error:', err);
      throw err;
    }
  }

  async imageChat(imageUrl: string, prompt: string, options: ChatOptions = {}) {
    try {
      const base64Image = await this.imageToBase64(imageUrl);
      
      const messages: ImageMessage[] = [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }];

      return this.chat(messages, options);
    } catch (err) {
      console.error('AI image chat error:', err);
      throw err;
    }
  }
}

export const ai = AI.getInstance();