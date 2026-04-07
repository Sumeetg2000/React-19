import { useQuery } from '@tanstack/react-query'
import { http } from '@/shared/api/http'
import type { Blog, BlogApiItem } from '@/shared/types/blog'
import { toBlog } from './useBlogs'

interface BlogResponse {
  data: BlogApiItem
}

export function useBlog(id?: string): ReturnType<typeof useQuery<Blog>> {
  return useQuery({
    queryKey: ['blog', id],
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    networkMode: 'online',
    queryFn: async (): Promise<Blog> => {
      const response = await http.get<BlogResponse>(`/blogs/${id}`)
      return toBlog(response.data.data)
    },
  })
}