'use client'

import { useState } from 'react';
import AddSiteDialog from '@/components/admin/AddSiteDialog';
import SiteTable from '@/components/admin/SiteTable';
import { Site } from '@/types/site';

export default function AdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setIsDialogOpen(true);
  };

  return (
    <main className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">网站管理</h1>
        <button
          onClick={() => {
            setEditingSite(null);
            setIsDialogOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg 
          hover:bg-blue-600 transition-colors"
        >
          添加网站
        </button>
      </div>

      <SiteTable onEdit={handleEdit} />
      
      <AddSiteDialog 
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingSite(null);
        }}
        site={editingSite}
      />
    </main>
  );
} 