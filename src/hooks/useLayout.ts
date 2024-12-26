import { useState, useEffect } from 'react';

type LayoutType = 'grid' | 'list' | 'masonry';

export function useLayout() {
  // 从 localStorage 读取布局偏好
  const [layout, setLayout] = useState<LayoutType>(() => {
    if (typeof window === 'undefined') return 'grid';
    return (localStorage.getItem('preferred_layout') as LayoutType) || 'grid';
  });

  // 保存布局偏好
  useEffect(() => {
    localStorage.setItem('preferred_layout', layout);
  }, [layout]);
  
  return [layout, setLayout] as const;
} 