import { ViewColumnsIcon, ListBulletIcon, WindowIcon } from '@heroicons/react/24/outline';

interface Props {
  layout: 'grid' | 'list' | 'masonry';
  onChange: (layout: 'grid' | 'list' | 'masonry') => void;
}

export default function LayoutSwitcher({ layout, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 p-1 bg-white/50 backdrop-blur-sm 
      rounded-lg border border-white/20">
      <button
        onClick={() => onChange('grid')}
        className={`p-2 rounded-md transition-colors ${
          layout === 'grid' ? 'bg-white text-gray-900' : 'text-gray-600'
        }`}
      >
        <ViewColumnsIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => onChange('list')}
        className={`p-2 rounded-md transition-colors ${
          layout === 'list' ? 'bg-white text-gray-900' : 'text-gray-600'
        }`}
      >
        <ListBulletIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => onChange('masonry')}
        className={`p-2 rounded-md transition-colors ${
          layout === 'masonry' ? 'bg-white text-gray-900' : 'text-gray-600'
        }`}
      >
        <WindowIcon className="w-5 h-5" />
      </button>
    </div>
  );
} 