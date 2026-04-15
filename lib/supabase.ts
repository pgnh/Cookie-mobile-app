import { createClient } from '@supabase/supabase-js'

// Get env vars with fallback for build/test environments
const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url && typeof window !== 'undefined') {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not defined')
  }
  return url || ''
}

const getSupabaseKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!key && typeof window !== 'undefined') {
    console.warn('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not defined')
  }
  return key || ''
}

// Client-side Supabase client (Browser) - lazy initialization
let browserClient: ReturnType<typeof createClient> | null = null

export const createBrowserClient = () => {
  if (browserClient) return browserClient
  
  const url = getSupabaseUrl()
  const key = getSupabaseKey()
  
  if (!url || !key) {
    throw new Error('Supabase URL and Key are required. Check your .env.local file.')
  }
  
  browserClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  
  return browserClient
}

// Server-side Supabase client (for API routes, Server Components)
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  )
}

// Admin client with service role (for admin operations only)
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
