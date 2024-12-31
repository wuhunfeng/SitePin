'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { openDB } from 'idb';
import { Bookmark } from '@/types/site';
import { SITE_TYPES } from '@/constants/site';

interface Stats {
  total: number;
  domains: Set<string>;
}

export default function ImportBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [importPage, setImportPage] = useState(1);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    domains: new Set<string>()
  });
  const itemsPerPage = 30;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const links = doc.getElementsByTagName('a');
      
      const importedBookmarks: Bookmark[] = [];
      const domains = new Set<string>();

      for (const link of Array.from(links)) {
        const url = link.getAttribute('href');
        const icon = link.getAttribute('ICON') || '';
        const addDate = link.getAttribute('ADD_DATE');
        
        if (url) {
          try {
            const domain = new URL(url).hostname;
            domains.add(domain);
            
            importedBookmarks.push({
              name: link.textContent || url,
              url,
              domain,
              description: '',
              tags: [],
              type: SITE_TYPES.find(type => type.value === 'other')?.value || 'other',
              addedAt: addDate ? parseInt(addDate) * 1000 : Date.now(),
              icon: icon || '',
              screenshot: ''
            });
          } catch (e) {
            console.log(e);
            console.error('Invalid URL:', url);
          }
        }
      }

      setBookmarks(importedBookmarks);
      setStats({
        total: importedBookmarks.length,
        domains
      });
    };
    reader.readAsText(file);
  };

  const saveToIndexedDB = async () => {
    const db = await openDB('bookmarks-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('bookmarks')) {
          const store = db.createObjectStore('bookmarks', { keyPath: 'url' });
          store.createIndex('domain', 'domain');
          store.createIndex('type', 'type');
          store.createIndex('addedAt', 'addedAt');
        }
      },
    });

    const tx = db.transaction('bookmarks', 'readwrite');
    const store = tx.objectStore('bookmarks');

    for (const bookmark of bookmarks) {
      await store.put(bookmark);
    }

    await tx.done;
  };

  const getCurrentPageItems = () => {
    const start = (importPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return bookmarks.slice(start, end);
  };

  const getTotalPages = () => Math.ceil(bookmarks.length / itemsPerPage);

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <input
          type="file"
          accept=".html"
          onChange={handleFileUpload}
          className="p-2 border rounded"
        />
        {bookmarks.length > 0 && (
          <button
            onClick={saveToIndexedDB}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存到数据库
          </button>
        )}
      </div>

      {stats.total > 0 && (
        <div className="mb-6">
          <p>总计: {stats.total} 个书签</p>
          <p>域名数: {stats.domains.size}</p>
        </div>
      )}

      {bookmarks.length > 0 && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCurrentPageItems().map((bookmark, index) => (
              <motion.div
                key={bookmark.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {bookmark.icon && (
                    <img 
                      src={bookmark.icon} 
                      alt=""
                      className="w-6 h-6 rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{bookmark.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{bookmark.url}</p>
                    {bookmark.domain && (
                      <p className="text-xs text-gray-500">{bookmark.domain}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {getTotalPages() > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setImportPage(p => Math.max(1, p - 1))}
                disabled={importPage === 1}
                className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
              >
                上一页
              </button>
              <span>
                {importPage} / {getTotalPages()}
              </span>
              <button
                onClick={() => setImportPage(p => Math.min(getTotalPages(), p + 1))}
                disabled={importPage === getTotalPages()}
                className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
} 