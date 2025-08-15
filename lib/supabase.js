
import { createClientComponentClient, createClient } from '@supabase/auth-helpers-nextjs'

//  Client for use inside "use client" components
export const supabase = createClientComponentClient()

//  Direct server client if you ever need it
export const createServerSupabase = (cookies) =>
    createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        { global: { headers: { Cookie: cookies } } }
    )
