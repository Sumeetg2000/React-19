import { useQuery } from '@tanstack/react-query'
import type { Blog } from '@/shared/types/blog'
import { http } from '@/shared/api/http'

export interface UseBlogsOptions {
  search?: string
}

export function useBlogs(options: UseBlogsOptions = {}): ReturnType<typeof useQuery<Blog[]>> {
  return useQuery({
    queryKey: ['blogs', options.search],
    queryFn: async (): Promise<Blog[]> => {
      const { data } = await http.get<Blog[]>('/blogs', {
        params: options.search ? { search: options.search } : {},
      })
      return data
    },
  })
}
