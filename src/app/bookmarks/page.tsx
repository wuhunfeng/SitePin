'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import ImportBookmarks from '@/components/bookmarks/ImportBookmarks';
import ManageBookmarks from '@/components/bookmarks/ManageBookmarks';

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState<'import' | 'manage'>('import');

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">书签管理</h1>
          
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('import')}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all duration-200
                ${activeTab === 'import' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow'}
              `}
            >
              导入书签
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all duration-200
                ${activeTab === 'manage' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow'}
              `}
            >
              书签管理
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-full mx-auto"
          >
            {activeTab === 'import' ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <ImportBookmarks />
              </div>
            ) : (
              <ManageBookmarks />
            )}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
} 