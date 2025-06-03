import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

let client: ReturnType<typeof createClientComponentClient> | null = null

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createClientComponentClient()
  }
  return client
}

// Auth helpers for client components
export const signOut = async () => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}