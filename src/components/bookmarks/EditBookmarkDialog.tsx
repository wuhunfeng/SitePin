'use client'

import { Dialog } from '../Dialog';
import { useState, useEffect } from 'react';
import { SITE_TYPES, PRESET_TAGS } from '@/constants/site';
import { Bookmark } from '@/types/site';
import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookmark: Bookmark | null;
  onSave: (bookmark: Bookmark) => Promise<void>;
}

export default function EditBookmarkDialog({ isOpen, onClose, bookmark, onSave }: Props) {
  const [formData, setFormData] = useState<Bookmark>({
    name: '',
    url: '',
    description: '',
    tags: [],
    type: 'website',
    addedAt: Date.now(),
    screenshot: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen && bookmark) {
      setFormData(bookmark);
      setHasChanges(false);
    }
  }, [bookmark, isOpen]);

  const handleChange = (changes: Partial<Bookmark>) => {
    setFormData(prev => {
      const newData = { ...prev, ...changes };
      setHasChanges(JSON.stringify(newData) !== JSON.stringify(bookmark));
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title="编辑书签"
      hasChanges={hasChanges}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              名称
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => handleChange({ name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={e => handleChange({ url: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <textarea
              value={formData.description}
              onChange={e => handleChange({ description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              截图
            </label>
            <input
              type="url"
              value={formData.screenshot}
              onChange={e => handleChange({ screenshot: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="输入截图URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标签
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_TAGS.map(tag => (
                <motion.button
                  key={tag}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChange({ 
                    tags: formData.tags.includes(tag)
                      ? formData.tags.filter(t => t !== tag)
                      : [...formData.tags, tag] 
                  })}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
            <input
              type="text"
              placeholder="自定义标签 (用逗号分隔)"
              value={formData.tags.filter(tag => !PRESET_TAGS.includes(tag)).join(',')}
              onChange={e => {
                const customTags = e.target.value
                  .split(',')
                  .map(tag => tag.trim())
                  .filter(Boolean);
                const presetTags = formData.tags.filter(tag => PRESET_TAGS.includes(tag));
                handleChange({
                  tags: [...new Set([...presetTags, ...customTags])]
                });
              }}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              类型
            </label>
            <select
              value={formData.type}
              onChange={e => handleChange({ type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {SITE_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            取消
          </button>
          <motion.button
            type="submit"
            disabled={!hasChanges}
            whileHover={{ scale: !hasChanges ? 1 : 1.02 }}
            whileTap={{ scale: !hasChanges ? 1 : 0.98 }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !hasChanges
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            保存
          </motion.button>
        </div>
      </form>
    </Dialog>
  );
} 