'use client'

import { useQuery } from '@tanstack/react-query'

export function useImageCache(url?: string) {
  return useQuery({
    queryKey: ['image', url],
    queryFn: async () => {
      if (!url) return null
      const res = await fetch(url)
      const blob = await res.blob()
      return URL.createObjectURL(blob)
    },
    enabled: !!url,
    staleTime: 1000 * 60 * 5,  // 5分钟内不重新请求
  })
} 