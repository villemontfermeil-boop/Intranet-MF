import { NextResponse } from "next/server";
import { cookies } from "next/headers";
type Context = {
  params: {
    id: string;
  };
};
const backendUrl = process.env.BACKEND_API;

export async function GET(request: Request, context: any) {
  // support both Promise params (when framework provides) and plain object
  const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params || {};
  const id = params?.id;
  console.log('[api-test] fetching user id=', id);
  if (!id || id === 'undefined') {
    console.warn('[api-test] missing or invalid id param', id);
    return NextResponse.json({ error: 'Missing or invalid id parameter' }, { status: 400 });
  }
    try {
        const cookiestore = await cookies();
        const credential = cookiestore.get('credential')?.value || '';

        const headers: Record<string, string> = {};
        if (credential) headers['Authorization'] = `Basic ${credential}`;

        const resp = await fetch(`${process.env.BACKEND_API}/salaries/${id}`, { headers });

        const text = await resp.text();

        if (!resp.ok) {
            console.error('[api-test] backend returned', resp.status, text);
            return NextResponse.json({ error: text || resp.statusText }, { status: resp.status });
        }

        if (!text) return NextResponse.json(null, { status: resp.status });

        try {
            const parsed = JSON.parse(text);
            return NextResponse.json(parsed, { status: resp.status });
        } catch (e) {
            // Not JSON — return raw text
            return new Response(text, { status: resp.status });
        }
    } catch (e: any) {
        console.error('[api-test] fetch error', e);
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
