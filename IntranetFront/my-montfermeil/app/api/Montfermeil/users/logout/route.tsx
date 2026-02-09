import { error } from "console";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.formData();
    const cookieStore = await cookies();
    const login = cookieStore.get('mail')?.value || "";
    const password = cookieStore.get('MDP')?.value || "";
    const credential = btoa(`${login}:${password}`);
    try {
        const response =await  fetch(`${process.env.BACKEND_API}/salaries/logout`, {
            method:"POST",
            headers: {
                "Authorization": `Basic ${credential}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(Object.fromEntries(body as any))
        })
        console.log(response)
        const JSON =await response.json();
        return new NextResponse(JSON, { status: 200 });
    }catch(Error){
        console.log(Error)
        console.log('credential:', credential)
        return new NextResponse("Erreur:"+Error, { status: 404 });

    }
}