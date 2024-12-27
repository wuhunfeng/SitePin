import { Dialog } from './Dialog';
import { XMarkIcon, PhotoIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Site } from '@/types/site';
import NextImage from 'next/image';
import { SITE_TYPES } from '@/constants/site';
import { motion } from 'framer-motion';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';

export default function MonitorDetailsDialog({ isOpen, onClose, site }: {
  isOpen: boolean;
  onClose: () => void;
  site: Site;
}) {
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.1 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const titleContent = (
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-semibold text-gray-900">{site.name}</h2>
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 hover:bg-zinc-100 rounded-full"
      >
        <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-500" />
      </motion.a>
    </div>
  );

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title={titleContent}
    >
      <motion.div
        initial="hidden"
        animate={isOpen ? "visible" : "exit"}
        exit="exit"
        variants={contentVariants}
      >
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold text-gray-800 mb-3">网站截图</h3>
            <motion.div 
              whileHover={{ scale: site.screenshot ? 1.02 : 1 }}
              className="bg-gray-50 rounded-lg overflow-hidden"
            >
              {site.screenshot ? (
                <NextImage
                  src={site.screenshot}
                  alt={site.name}
                  width={1920}
                  height={1080}
                  placeholder="blur"
                  blurDataURL={site.screenshot}
                  className="max-w-full h-auto cursor-zoom-in"
                  unoptimized
                  onClick={() => {
                    // 获取原始图片尺寸
                    const img = new Image();
                    img.src = site.screenshot || '';
                    
                    img.onload = () => {
                      const screenWidth = window.innerWidth;
                      const screenHeight = window.innerHeight;
                      const imageRatio = img.width / img.height;
                      
                      // 计算适配屏幕的尺寸
                      let w = img.width;
                      let h = img.height;
                      
                      if (w > screenWidth * 0.9) {
                        w = screenWidth * 0.9;
                        h = w / imageRatio;
                      }
                      
                      if (h > screenHeight * 0.9) {
                        h = screenHeight * 0.9;
                        w = h * imageRatio;
                      }

                      const pswp = new PhotoSwipe({
                        dataSource: [{
                          src: site.screenshot || '',
                          w: Math.round(w),
                          h: Math.round(h),
                          alt: site.name
                        }],
                        showHideAnimationType: 'fade',
                        pswpModule: () => import('photoswipe')
                      });
                      pswp.init();
                    };
                  }}
                />
              ) : (
                <div className="aspect-video w-full flex items-center justify-center">
                  <PhotoIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold text-gray-800 mb-3">网站介绍</h3>
            <p className="text-gray-700">
              {site.description || '暂无介绍'}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold text-gray-800 mb-3">网站信息</h3>
            <motion.div 
              className="bg-gray-50 rounded-lg p-4 space-y-3"
              whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.9)" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">网址</span>
                <span className="text-gray-900">{site.url}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">类型</span>
                <span className="text-gray-900">
                  {SITE_TYPES.find(type => type.value === site.type)?.label || '未知'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">标签</span>
                <span className="text-gray-900">{site.tags.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">创建时间</span>
                <span className="text-gray-900">
                  {new Date(site.createdAt).toLocaleString()}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </Dialog>
  );
} 