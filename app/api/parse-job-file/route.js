import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import fs from "fs"
import mammoth from "mammoth"

export const config = {
    api: {
        bodyParser: false,
    },
}

export async function POST(request) {
    // Supabase Auth
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401 })
    }

    // Convert Web Request to Node-like buffer
    const buffer = Buffer.from(await request.arrayBuffer())
    const tmpPath = "/tmp/uploaded-file.docx"
    fs.writeFileSync(tmpPath, buffer)

    // Extract text
    let extractedText = ""
    try {
        const result = await mammoth.extractRawText({ path: tmpPath })
        extractedText = result.value
    } catch (err) {
        console.error(err)
        fs.unlinkSync(tmpPath)
        return new Response(JSON.stringify({ error: "Failed to extract text" }), { status: 500 })
    }

    fs.unlinkSync(tmpPath)

    // Parse text
    const { title, companyName, description } = parseJobDescription(extractedText)

    return new Response(JSON.stringify({ title, companyName, description }), { status: 200 })
}

// Simple parser
function parseJobDescription(text) {
    const lines = text.split("\n").filter((l) => l.trim())
    let title = ""
    let companyName = ""
    const description = text

    const titlePatterns = [
        /^(job title|position|role):\s*(.+)/i,
        /^(.+?)\s*-\s*(job|position|role)/i,
        /^([A-Z][^.!?]*(?:engineer|developer|manager|analyst|specialist|coordinator|assistant|director|lead|senior|junior))/i,
    ]
    for (const line of lines.slice(0, 5)) {
        for (const pattern of titlePatterns) {
            const match = line.match(pattern)
            if (match && match[2]) title = match[2].trim()
            else if (match && match[1] && !title) title = match[1].trim()
        }
        if (title) break
    }

    const companyPatterns = [
        /^(company|organization|employer):\s*(.+)/i,
        /at\s+([A-Z][a-zA-Z\s&.,]+(?:Inc|LLC|Corp|Ltd|Company|Technologies|Solutions|Systems))/i,
        /([A-Z][a-zA-Z\s&.,]+(?:Inc|LLC|Corp|Ltd|Company|Technologies|Solutions|Systems))/i,
    ]
    for (const line of lines.slice(0, 10)) {
        for (const pattern of companyPatterns) {
            const match = line.match(pattern)
            if (match && match[2]) companyName = match[2].trim()
            else if (match && match[1] && !companyName) companyName = match[1].trim()
        }
        if (companyName) break
    }

    return { title: title || "Untitled Position", companyName: companyName || "", description: description.trim() }
}
