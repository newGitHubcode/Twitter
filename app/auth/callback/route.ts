import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
	try {const requestUrl =  new URL(request.url)
	const code = requestUrl.searchParams.get('code')

	if (code) {
		const supabase = createRouteHandlerClient<Database>({ cookies })
		await supabase.auth.exchangeCodeForSession(code)
	}} catch(err) {
		console.log(err)
	}

	return NextResponse.redirect(requestUrl.origin)
}
