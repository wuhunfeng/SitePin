import { Dialog } from './Dialog';
import { StoredMonitor } from '@/lib/db';
import { XMarkIcon, PhotoIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Site } from '@/types/site';
import Image from 'next/image';
import { useState } from 'react';
import { SITE_TYPES } from '@/constants/site';

export default function MonitorDetailsDialog({ isOpen, onClose, monitor, site }: {
  isOpen: boolean;
  onClose: () => void;
  monitor: StoredMonitor;
  site: Site;
}) {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">{site.name}</h2>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-500" />
            </a>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors
            hover:rotate-90 transition-all duration-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-8">
          {/* 网站截图 */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">网站截图</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              {site.screenshot ? (
                <Image
                  src={site.screenshot}
                  alt={site.name}
                  width={1920}
                  height={1080}
                  className="max-w-full h-auto cursor-zoom-in"
                  unoptimized
                  onClick={() => setIsImageOpen(true)}
                />
              ) : (
                <div className="aspect-video w-full flex items-center justify-center">
                  <PhotoIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* 网站介绍 */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">网站介绍</h3>
            <p className="text-gray-700">
              {site.description || '暂无介绍'}
            </p>
          </div>

          {/* 网站信息 */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">网站信息</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">网址</span>
                <span className="text-gray-900">{site.url}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">类型</span>
                <span className="text-gray-900">{SITE_TYPES.find(type => type.value === site.type)?.label || '未知'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">标签</span>
                <span className="text-gray-900">{site.tags.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">创建时间</span>
                <span className="text-gray-900">{new Date(site.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* 图片放大对话框 */}
      {isImageOpen && site.screenshot && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setIsImageOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={() => setIsImageOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <Image
            src={site.screenshot}
            alt={site.name}
            width={1920}
            height={1080}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            unoptimized
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
} 