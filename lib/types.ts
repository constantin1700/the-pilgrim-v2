// Country types
export interface Country {
  id: string
  name: string
  code: string
  countryCode?: string // For backwards compatibility
  continent: string
  capital?: string
  population?: number
  gdp_per_capita?: number
  main_language?: string
  currency?: string
  temperature?: number
  quality_of_life?: number
  average_salary?: number
  salary_expense_ratio?: number
  social_index?: number
  bureaucracy_ease?: number
  // Legacy names for backwards compatibility
  qualityOfLife?: number
  averageSalary?: number
  salaryExpenseRatio?: number
  socialIndex?: number
  bureaucracyEase?: number
  likesTotal: number
  likesDashboard: number
  likesBlog: number
  likes_dashboard?: number
  likes_explorer?: number
  likes_total?: number
  coverImage?: string
  generalInfo?: CountrySection
  opportunities?: CountrySection
  costOfLiving?: CountrySection
  usefulData?: CountrySection
  createdAt?: Date
  updatedAt?: Date
}

export interface CountrySection {
  title: string
  content: string
  subsections?: {
    title: string
    content: string
  }[]
}

// Blog types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  countryId: string
  countryName?: string
  likes: number
  readingTime: number
  published: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  postId: string
  authorName: string
  authorEmail?: string
  content: string
  approved: boolean
  createdAt: Date
}

// Service types
export interface Service {
  id: string
  type: 'basic' | 'personalized' | 'premium'
  price: number
  title: string
  description: string
  features: string[]
  monthlyLimit?: number
  availableSlots?: number
  isActive: boolean
}

export interface Reservation {
  id: string
  serviceId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  stripeSessionId?: string
  createdAt: Date
}

// Dashboard filters
export interface DashboardFilters {
  climate?: { min: number; max: number }
  qualityOfLife?: { min: number; max: number }
  salary?: { min: number; max: number }
  salaryRatio?: { min: number; max: number }
  socialIndex?: { min: number; max: number }
  bureaucracy?: { min: number; max: number }
  search?: string
}

// Admin types
export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'editor'
  createdAt: Date
}