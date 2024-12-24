import { Dialog } from './Dialog';
import { StoredMonitor } from '@/lib/db';
import { 
  XMarkIcon,
  ClockIcon,
  GlobeAltIcon,
  CalendarIcon,
  CheckCircleIcon,
  CalendarDateRangeIcon,
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

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
      


      <div className="space-y-4">

        <div className="flex items-center gap-3 text-gray-600">
          <CheckCircleIcon className="w-5 h-5" />
          <span>Status: {getStatusText(monitor.status)}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <ClockIcon className="w-5 h-5" />
          <span>Response Time: {monitor.average_response_time ? `${monitor.average_response_time}ms` : 'N/A'}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <GlobeAltIcon className="w-5 h-5" />
          <span>URL: {monitor.url}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <CalendarIcon className="w-5 h-5" />
          <span>Created: {new Date(monitor.create_datetime * 1000).toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <CalendarDateRangeIcon className="w-5 h-5" />
          <span>Last Updated: {formatDistanceToNow(new Date(monitor.lastUpdated), { addSuffix: true })}</span>
        </div>

      </div>
    </Dialog>
  );
} 