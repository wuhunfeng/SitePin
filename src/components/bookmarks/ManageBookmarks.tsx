'use client'

import { useState, useEffect } from 'react';
import { openDB } from 'idb';
import { SITE_TYPES } from '@/constants/site';
import { Bookmark } from '@/types/site';
import EditBookmarkDialog from './EditBookmarkDialog';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import AIBookmarkDialog from './AIBookmarkDialog';

export default function ManageBookmarks() {
  const [savedBookmarks, setSavedBookmarks] = useState<Bookmark[]>([]);
  const [managePage, setManagePage] = useState(1);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Bookmark[]>([]);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const itemsPerPage = 20;
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);

  useEffect(() => {
    loadSavedBookmarks();
  }, []);

  const loadSavedBookmarks = async () => {
    const db = await openDB('bookmarks-db', 1);
    const tx = db.transaction('bookmarks', 'readonly');
    const store = tx.objectStore('bookmarks');
    const bookmarks = await store.getAll();
    setSavedBookmarks(bookmarks);
  };

  const deleteBookmark = async (url: string) => {
    const db = await openDB('bookmarks-db', 1);
    await db.delete('bookmarks', url);
    await loadSavedBookmarks();
    setToast({
      show: true,
      type: 'success',
      message: '书签已删除'
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsDialogOpen(true);
  };

  const handleSave = async (updatedBookmark: Bookmark) => {
    try {
      const db = await openDB('bookmarks-db', 1);
      await db.put('bookmarks', updatedBookmark);
      await loadSavedBookmarks();
      setToast({
        show: true,
        type: 'success',
        message: '书签已更新'
      });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({
        show: true,
        type: 'error',
        message: '保存失败'
      });
      setTimeout(() => setToast(null), 3000);
      console.error('Save error:', error);
    }
  };

  const getCurrentPageItems = () => {
    const start = (managePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return savedBookmarks.slice(start, end);
  };

  const getTotalPages = () => Math.ceil(savedBookmarks.length / itemsPerPage);

  const handleBulkDelete = async () => {
    const db = await openDB('bookmarks-db', 1);
    const tx = db.transaction('bookmarks', 'readwrite');
    const store = tx.objectStore('bookmarks');
    
    for (const bookmark of selectedItems) {
      await store.delete(bookmark.url);
    }
    
    await tx.done;
    await loadSavedBookmarks();
    setSelectedItems([]);
    setIsAllSelected(false);
    
    setToast({
      show: true,
      type: 'success',
      message: '已删除选中的书签'
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAIGenerate = async (bookmarks: Bookmark[]) => {
    try {
      const db = await openDB('bookmarks-db', 1);
      const tx = db.transaction('bookmarks', 'readwrite');
      const store = tx.objectStore('bookmarks');
      
      for (const bookmark of bookmarks) {
        await store.put(bookmark);
      }
      
      await tx.done;
      await loadSavedBookmarks();
      
      setToast({
        show: true,
        type: 'success',
        message: 'AI 已更新选中的书签'
      });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({
        show: true,
        type: 'error',
        message: '更新失败'
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white z-50`}>
          {toast.message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => {
                    setIsAllSelected(e.target.checked);
                    setSelectedItems(e.target.checked ? getCurrentPageItems() : []);
                  }}
                  className="form-checkbox"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                网址
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标签
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                描述
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                截图
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getCurrentPageItems().map((bookmark) => (
              <tr key={bookmark.url} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(bookmark)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(prev => [...prev, bookmark]);
                      } else {
                        setSelectedItems(prev => prev.filter(b => b !== bookmark));
                      }
                    }}
                    className="form-checkbox"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{bookmark.name}</div>
                </td>
                <td className="px-6 py-4">
                  <a 
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    {bookmark.url}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {SITE_TYPES.find(t => t.value === bookmark.type)?.label || bookmark.type}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {bookmark.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs 
                          font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 line-clamp-2">{bookmark.description}</div>
                </td>
                <td className="px-6 py-4">
                  {bookmark.screenshot && (
                    <a 
                      href={bookmark.screenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      查看截图
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(bookmark)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteBookmark(bookmark.url)}
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

      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-white rounded-lg shadow-lg flex gap-2">
          <button
            onClick={() => setIsAIDialogOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            AI 生成 ({selectedItems.length})
          </button>
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            删除选中 ({selectedItems.length})
          </button>
        </div>
      )}

      {getTotalPages() > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setManagePage(p => Math.max(1, p - 1))}
            disabled={managePage === 1}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
          >
            上一页
          </button>
          <span>
            {managePage} / {getTotalPages()}
          </span>
          <button
            onClick={() => setManagePage(p => Math.min(getTotalPages(), p + 1))}
            disabled={managePage === getTotalPages()}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}

      <EditBookmarkDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingBookmark(null);
        }}
        bookmark={editingBookmark}
        onSave={handleSave}
      />

      <AIBookmarkDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        bookmarks={selectedItems}
        onSave={handleAIGenerate}
      />
    </div>
  );
} 