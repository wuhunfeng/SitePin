import { useState } from 'react';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | {
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }[];
}

export function useOpenAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chat = async (messages: Message[], stream = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, stream })
      });
      
      if (!res.ok) throw new Error('API request failed');

      if (stream) {
        // 处理流式响应
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let text = '';

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value);
          // 这里可以添加回调函数来处理实时文本
        }
        return text;
      }
      
      return await res.json();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { chat, loading, error };
} 