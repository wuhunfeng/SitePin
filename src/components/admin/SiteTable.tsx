'use client'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { SITE_TYPES } from '@/constants/site';
import { Site } from '@/types/site';
import { useSites } from '@/hooks/useSites';


interface Props {
  onEdit: (site: Site) => void;
}

export default function SiteTable({ onEdit }: Props) {
  const { sites, loading, refetch } = useSites();

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个网站吗?')) return;
    
    try {
      const res = await fetch(`/api/sites/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Failed to delete site:', error);
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              网站名称
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              网址
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              描述
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              类型
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              标签
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              截图
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              创建时间
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sites.map((site) => (
            <tr key={site._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{site.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={site.url} target="_blank" rel="noopener noreferrer" 
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  {site.url}
                </a>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 line-clamp-2">{site.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {SITE_TYPES.find(t => t.value === site.type)?.label || site.type}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {site.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs 
                      font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <a href={site.screenshot} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-700">
                  {site.screenshot}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(site.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(site)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(site._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 