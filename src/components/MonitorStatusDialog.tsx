import { Dialog } from './Dialog';
import { StoredMonitor } from '@/types/site';
import { 
  ClockIcon,
  GlobeAltIcon,
  CalendarIcon,
  CheckCircleIcon,
  CalendarDateRangeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

export default function MonitorStatusDialog({ 
  isOpen, 
  onClose, 
  monitor 
}: { 
  isOpen: boolean;
  onClose: () => void;
  monitor: StoredMonitor;
}) {
  const getStatusText = (status: number) => {
    switch (status) {
      case 2: return 'Up';
      case 9: return 'Paused';
      default: return 'Down';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 2: return 'text-green-500';
      case 9: return 'text-yellow-500';
      default: return 'text-red-500';
    }
  };

  const titleContent = (
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-semibold text-gray-900">
        {monitor.friendly_name || "N/A"}
      </h2>
    </div>
  );

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      x: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title={titleContent}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-6"
      >
        <div className="space-y-4">
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-3 bg-gray-50/50 p-4 rounded-lg"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                transition: { repeat: Infinity, duration: 2 }
              }}
            >
              <CheckCircleIcon className={`w-5 h-5 ${getStatusColor(monitor.status)}`} />
            </motion.div>
            <div>
              <span className="text-sm font-medium text-gray-700">状态</span>
              <p className={`text-base ${getStatusColor(monitor.status)}`}>
                {getStatusText(monitor.status)}
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-3 bg-gray-50/50 p-4 rounded-lg"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                transition: { repeat: Infinity, duration: 8, ease: "linear" }
              }}
            >
              <ClockIcon className="w-5 h-5 text-gray-500" />
            </motion.div>
            <div>
              <span className="text-sm font-medium text-gray-700">响应时间</span>
              <p className="text-base text-gray-900">
                {monitor.average_response_time ? `${monitor.average_response_time}ms` : 'N/A'}
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-3 bg-gray-50/50 p-4 rounded-lg"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <GlobeAltIcon className="w-5 h-5 text-gray-500" />
            </motion.div>
            <div>
              <span className="text-sm font-medium text-gray-700">URL</span>
              <p className="text-base text-gray-900 break-all">{monitor.url}</p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-3 bg-gray-50/50 p-4 rounded-lg"
          >
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <div>
              <span className="text-sm font-medium text-gray-700">创建时间</span>
              <p className="text-base text-gray-900">
                {new Date(monitor.create_datetime * 1000).toLocaleString()}
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-3 bg-gray-50/50 p-4 rounded-lg"
          >
            <CalendarDateRangeIcon className="w-5 h-5 text-gray-500" />
            <div>
              <span className="text-sm font-medium text-gray-700">最后更新</span>
              <p className="text-base text-gray-900">
                {formatDistanceToNow(new Date(monitor.lastUpdated), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Dialog>
  );
} 