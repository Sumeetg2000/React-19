import { useQuery } from '@tanstack/react-query'
import type { Blog, BlogApiItem } from '@/shared/types/blog'
import { http } from '@/shared/api/http'

export interface UseBlogsOptions {
  search?: string
}

interface BlogsResponse {
  data: BlogApiItem[]
}

export const toBlog = (item: BlogApiItem): Blog => ({
  id: item.id,
  title: item.title,
  content: item.content,
  excerpt: item.content.length > 140 ? `${item.content.slice(0, 140)}...` : item.content,
  author: item.author.name,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  tags: [],
  authorId: item.authorId,
})

export function useBlogs(options: UseBlogsOptions = {}): ReturnType<typeof useQuery<Blog[]>> {
  return useQuery({
    queryKey: ['blogs', options.search],
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    networkMode: 'online',
    queryFn: async (): Promise<Blog[]> => {
      const response = await http.get<BlogsResponse>('/blogs', {
        params: options.search ? { search: options.search } : {},
      })
      return response.data.data.map(toBlog)
    },
  })
}
