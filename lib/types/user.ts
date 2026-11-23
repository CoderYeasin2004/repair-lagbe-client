export interface User {
  id: string
  name: string
  email: string
  role?: string
  image?: string | null
  phone?: string | null
  area?: string | null
  bio?: string | null
  createdAt?: string | Date
}