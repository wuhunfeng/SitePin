import { Dialog } from '../Dialog';
import { useState, useEffect } from 'react';
import { SITE_TYPES, PRESET_TAGS } from '@/constants/site';
import { Site, SiteFormData } from '@/types/site';
import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  site?: Site | null;
}

export default function AddSiteDialog({ isOpen, onClose, site }: Props) {
  const [formData, setFormData] = useState<SiteFormData>({
    name: '',
    url: '',
    description: '',
    tags: [],
    type: 'personal',
    screenshot: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: site?.name ?? '',
        url: site?.url ?? '',
        description: site?.description ?? '',
        tags: site?.tags ?? [],
        type: site?.type ?? 'personal',
        screenshot: site?.screenshot ?? ''
      });
      setHasChanges(false);
    }
  }, [site, isOpen]);

  const handleChange = (changes: Partial<SiteFormData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...changes };
      setHasChanges(
        JSON.stringify(newData) !== JSON.stringify({
          name: site?.name ?? '',
          url: site?.url ?? '',
          description: site?.description ?? '',
          tags: site?.tags ?? [],
          type: site?.type ?? 'personal',
          screenshot: site?.screenshot ?? ''
        })
      );
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(site ? `/api/sites/${site._id}` : '/api/sites', {
        method: site ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to save site:', error);
    }
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title={site ? '编辑网站' : '添加网站'}
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
              网站名称
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
              网址
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
              网站截图
            </label>
            <input
              type="url"
              placeholder="输入图片URL"
              value={formData.screenshot}
              onChange={e => handleChange({ screenshot: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            disabled={site && !hasChanges}
            whileHover={{ scale: site && !hasChanges ? 1 : 1.02 }}
            whileTap={{ scale: site && !hasChanges ? 1 : 0.98 }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              site && !hasChanges
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {site ? '保存' : '添加'}
          </motion.button>
        </div>
      </form>
    </Dialog>
  );
} 