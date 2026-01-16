import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.formData();
    const login = cookieStore.get('mail');
    const password = cookieStore.get('MDP');
    const credential = btoa(`${login}:${password}`);
    try {
        const Response = fetch(`${process.env.BACKEND_API}/salaries/logout`, {
            headers: {
                "Authorization": `Basic ${credential}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(Object.fromEntries(body as any))
        })
        console.log(Response)
        const JSON = await (await Response).json();
        return new NextResponse(JSON, { status: 200 });
    }catch(Error){
        console.log(Error)
        console.log('credential:', credential)
        return new NextResponse("Erreur:"+Error, { status: 404 });

    }
}