export interface Blog {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
  authorId: string
}

export interface BlogApiItem {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  authorId: string
  author: {
    id: string
    name: string
    email: string
  }
}
