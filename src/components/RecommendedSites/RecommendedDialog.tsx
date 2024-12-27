import { Dialog } from '../Dialog';
import { useSites } from '@/hooks/useSites';
import { useState, useEffect } from 'react';
import { Site } from '@/types/site';
import { ai } from '@/lib/ai';
import MonitorDetailsDialog from '../MonitorDetailsDialog';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  site: Site | null;
  onSiteChange: (site: Site) => void;
}

export function RecommendedDialog({ isOpen, onClose, site, onSiteChange }: Props) {
  const { sites } = useSites();
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 获取AI推荐理由
  const getRecommendation = async (site: Site) => {
    setIsGenerating(true);  // 开始生成
    setLoading(true);
    setRecommendation('AI 正在分析网站，即将生成推荐...');
    
    const basePrompt = `作为一位资深网站推荐专家，请分析这个网站的信息，生成专业的推荐。

    网站基本信息：
    - 网站名称：${site.name}
    - 网站地址：${site.url}
    - 网站描述：${site.description}
    `;
    
    const endPrompt = `要求：
    - 表达专业详实，充斥着冷幽默的气息
    - 内容控制在300字以内
    - 直接输出推荐理由，不要输出"xxx的专业推荐""希望我的分析符合您的需求"此类的废话`;

    const withScreenshotPrompt = `${basePrompt}
    图片是该网站的界面，分析截图中展示的界面设计、功能和视觉特点，并结合以下几个方面：
    1. 结合网站截图和网站描述，说明其核心价值和独特功能
    2. 用一个生动有趣的比喻来形容这个网站
    3. 给出你的个人看法，要求极具个人情感，必须是暴论 
    ${endPrompt}`;

    const withoutScreenshotPrompt = `${basePrompt}
    请从以下几个方面推荐这个网站：
    1. 基于网站名称和描述，分析其可能的功能和特点
    2. 说明其潜在的核心价值和独特之处
    3. 用一个生动有趣的比喻来形容这个网站
    4. 给出你的个人看法，要求极具个人情感，必须是暴论
    ${endPrompt}`;

    try {
      if (site.screenshot) {
        ai.imageChat(site.screenshot, withScreenshotPrompt, {
          onStream: (text) => setRecommendation(text),
          onFinish: () => {
            setLoading(false);
          }
        });
      } else {
        ai.chat([{
          role: 'user',
          content: withoutScreenshotPrompt
        }], {
          onStream: (text) => setRecommendation(text),
          onFinish: () => {
            setLoading(false);
          }
        });
      }
    } catch (error) {
      console.error('Failed to get recommendation:', error);
      setRecommendation('抱歉，生成推荐理由时出现错误');
      setIsGenerating(false);  // 发生错误时重置
    } finally {
      // setLoading(false);
    }
  };

  // 随机选择一个站点
  const getRandomSite = () => {
    if (sites.length === 0) return;
    const randomIndex = Math.floor(Math.random() * sites.length);
    const newSite = sites[randomIndex];
    setCurrentSite(newSite);
    onSiteChange(newSite);
    // 重置所有状态
    setRecommendation('');
    setIsGenerating(false);
    setLoading(false);
  };

  // 只在对话框首次打开时自动获取推荐
  useEffect(() => {
    if (isOpen && sites.length > 0 && !currentSite) {
      const initialSite = site || sites[0];
      setCurrentSite(initialSite);
      getRecommendation(initialSite);
    }
  }, [isOpen, sites]);


  if (!currentSite) return null;

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">AI 智能推荐</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            <motion.div 
              className="relative flex items-center gap-3 bg-gray-50/50 p-3 rounded-lg 
                border border-gray-100/80 backdrop-blur-sm cursor-pointer
                hover:bg-gray-100/50 transition-colors group"
              onClick={() => setShowDetails(true)}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-2 top-2 text-xs text-gray-400
                  bg-white/80 px-2 py-1 rounded-full border border-gray-100
                  opacity-0 group-hover:opacity-100 transition-opacity"
              >
                点击查看详情
              </motion.div>

              <div className="w-16 h-16 bg-gray-100/70 rounded-lg overflow-hidden flex-shrink-0 
                border border-gray-200/50">
                {currentSite?.screenshot && (
                  <motion.img 
                    src={currentSite.screenshot} 
                    alt={currentSite.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">{currentSite?.name}</h3>
                <p className="text-sm text-gray-600">{currentSite?.url}</p>
              </div>

              <motion.div
                className="absolute inset-0 rounded-lg bg-white/20"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.1, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            </motion.div>

            <div className="bg-gray-50/30 backdrop-blur-sm rounded-xl p-4 
              border border-gray-200/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-gray-100/80 
                  flex items-center justify-center border border-gray-200/50">
                  <span className="text-gray-700 text-xs">AI</span>
                </div>
                <div className="text-sm font-medium text-gray-700">为什么推荐这个网站？</div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                {isGenerating ? (
                  <ReactMarkdown className="prose prose-sm max-w-none">
                    {recommendation}
                  </ReactMarkdown>
                ) : (
                  <button
                    onClick={() => getRecommendation(currentSite)}
                    className="px-3 py-1.5 bg-gray-800/90 text-white rounded-lg 
                      hover:bg-gray-900 transition-colors text-sm shadow-sm"
                  >
                    生成推荐理由
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              {loading ? (
                <div className="px-4 py-2 bg-gray-800/90 text-white rounded-lg text-sm shadow-sm backdrop-blur-sm">
                  正在生成中...
                </div>
              ) : (
                <button 
                  onClick={getRandomSite}
                  className="px-4 py-2 bg-gray-800/90 text-white rounded-lg 
                    hover:bg-gray-900 transition-colors text-sm shadow-sm
                    backdrop-blur-sm" 
                >
                  换一个推荐
                </button>
              )}
              <a 
                href={currentSite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-800 
                  flex items-center gap-1 transition-colors"
              >
                访问网站 →
              </a>
            </div>
          </div>
        </div>
      </Dialog>

      {currentSite && (
        <MonitorDetailsDialog
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          site={currentSite}
        />
      )}
    </>
  );
}