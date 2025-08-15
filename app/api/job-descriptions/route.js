import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 })
    }

    const { title, companyName, description, document_url } = await request.json()
    if (!title || !description) {
        return new Response(JSON.stringify({ error: 'Title and description are required' }), { status: 400 })
    }

    const { data, error } = await supabase.from('js_description').insert({
        title,
        company_name: companyName || null,
        description,
        document_url: document_url || null,
        created_by_id: user.id
    })

    if (error) {
        return new Response(JSON.stringify({ error: 'Database insert failed', details: error }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 201 })
}

export async function GET() {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 })
    }

    const { data, error } = await supabase
        .from('js_description')
        .select('*')
        .eq('created_by_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return new Response(JSON.stringify({ error: 'Database fetch failed', details: error }), { status: 500 })
    }

    return new Response(JSON.stringify({ data }), { status: 200 })
}
