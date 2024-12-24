import { Dialog } from './Dialog';
import { StoredMonitor } from '@/lib/db';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function MonitorDetailsDialog({ 
  isOpen, 
  onClose, 
  monitor 
}: { 
  isOpen: boolean;
  onClose: () => void;
  monitor: StoredMonitor;
}) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium flex items-center gap-2">
          {monitor.friendly_name}
        </h2>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors
          hover:rotate-90 transition-all duration-200"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-6">
        {/* 网站截图 */}
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <PhotoIcon className="w-12 h-12 text-gray-400" />
        </div>

        {/* 网站介绍 */}
        <div>
          <h3 className="text-lg font-medium mb-2">网站介绍</h3>
          <p className="text-gray-600">
            这是一个示例网站介绍文本。该网站提供了各种功能和服务，具体内容待补充。
          </p>
        </div>

        {/* 监控说明 */}
        <div>
          <h3 className="text-lg font-medium mb-2">监控说明</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-600">监控频率：每 5 分钟</p>
            <p className="text-sm text-gray-600">监控类型：HTTP & HTTPS</p>
            <p className="text-sm text-gray-600">告警阈值：响应时间 > 2000ms</p>
          </div>
        </div>

        {/* 变更历史 */}
        <div>
          <h3 className="text-lg font-medium mb-2">变更历史</h3>
          <div className="space-y-3">
            {[1,2,3].map((_, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-24 flex-shrink-0 text-gray-500">
                  {`${3-i}天前`}
                </div>
                <div className="flex-1 text-gray-600">
                  检测到网站内容发生变化，变化率约 {Math.floor(Math.random() * 10)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 技术信息 */}
        <div>
          <h3 className="text-lg font-medium mb-2">技术信息</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-gray-500">服务器</div>
                <div className="text-gray-700">Nginx/1.20.1</div>
              </div>
              <div>
                <div className="text-gray-500">IP 位置</div>
                <div className="text-gray-700">美国 / 加利福尼亚</div>
              </div>
              <div>
                <div className="text-gray-500">SSL 证书</div>
                <div className="text-gray-700">Let's Encrypt</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 