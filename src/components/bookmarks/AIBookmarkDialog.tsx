'use client'

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ai } from '@/lib/ai';
import { Bookmark } from '@/types/site';
import { SITE_TYPES } from '@/constants/site';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onSave: (bookmarks: Bookmark[]) => void;
}

export default function AIBookmarkDialog({ isOpen, onClose, bookmarks, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const generateBookmarks = async () => {
    setLoading(true);
    const processedBookmarks: Bookmark[] = [];

    for (const bookmark of bookmarks) {
      try {
        setProgress(`正在处理: ${bookmark.name} - ${bookmark.url}`);
        
        const prompt = `搜索网站[名称：${bookmark.name}，地址：${bookmark.url}]，并根据搜索结果生成网站信息。
请以JSON格式返回，包含以下字段，注意尽可能使用中文：
{
  "name": "网站名称",
  "description": "100字以内的网站描述",
  "type": "网站类型(在线工具|资源下载|影音媒体|社区论坛|文档教程|AI服务|开发者|设计创意|资讯|生活服务|教育学习|游戏娱乐|购物商城|社交平台|金融理财|医疗健康|旅游出行|求职招聘|阅读文学|音乐音频|视频直播|体育运动|NSFW|未分类)",
  "tags": ["相关标签，至少2个，不超过5个"]
}`;

        const result = await ai.chat([{
          role: 'user',
          content: prompt
        }]);

         // 从 AI 响应中提取所需字段
        const nameMatch = result.match(/"name"\s*:\s*"([^"]+)"/);
        const descMatch = result.match(/"description"\s*:\s*"([^"]+)"/);
        const typeMatch = result.match(/"type"\s*:\s*"([^"]+)"/);
        const tagsMatch = result.match(/"tags"\s*:\s*\[(.*?)\]/);

      // 构建规范的数据对象
        const data = {
          name: nameMatch?.[1] || bookmark.name,
          description: descMatch?.[1] || '',
          type: SITE_TYPES.find(t => t.label === typeMatch?.[1])?.label || '未分类',
          tags: tagsMatch ? JSON.parse(`[${tagsMatch[1]}]`) : []
        };

        processedBookmarks.push({
          url: bookmark.url,
          ...data,
          screenshot: '',
          addedAt: new Date().getTime()
        });
      } catch (err) {
        console.error(`处理 ${bookmark.url} 时出错:`, err);
      }
    }

    setLoading(false);
    onSave(processedBookmarks);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-sm">
          <Dialog.Title className="text-lg font-medium mb-4">
            AI 生成书签信息
          </Dialog.Title>

          <div className="mb-4">
            选中了 {bookmarks.length} 个书签进行处理
          </div>

          {loading && (
            <div className="text-sm text-gray-500">
              {progress}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              取消
            </button>
            <button
              onClick={generateBookmarks}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              开始生成
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 