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
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
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

        <div className="flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-700">Status</span>
            <p className="text-base text-gray-900">{getStatusText(monitor.status)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ClockIcon className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-700">Response Time</span>
            <p className="text-base text-gray-900">{monitor.average_response_time ? `${monitor.average_response_time}ms` : 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GlobeAltIcon className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-700">URL</span>
            <p className="text-base text-gray-900">{monitor.url}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-700">Created</span>
            <p className="text-base text-gray-900">{new Date(monitor.create_datetime * 1000).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDateRangeIcon className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-700">Last Updated</span>
            <p className="text-base text-gray-900">{formatDistanceToNow(new Date(monitor.lastUpdated), { addSuffix: true })}</p>
          </div>
        </div>

      </div>
    </Dialog>
  );
} 