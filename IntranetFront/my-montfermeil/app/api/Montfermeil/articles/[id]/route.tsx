import { NextResponse } from "next/server";




export async function GET(request: Request, context: any) {
    const params = await context?.params && typeof context.params.then === 'function' ? await context.params : context?.params || {};
    const id = await params?.id;
    const backend = process.env.BACKEND_API
    const auth = await request.headers.get("Authorization");
    if (auth == null) {
        return NextResponse.json("Authorisation manquant", { status: 400 })

    }

    try {
        const data = await fetch(`${backend}/Article/${id}`, {
            headers: {
                'Authorization': auth || '',
            }
        })
        const json = await data.json();
        console.log(json)

        return NextResponse.json(json, { status: data.status })
    } catch (e) {
        return NextResponse.json(e, { status: 500 })

    }
}