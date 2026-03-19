import { request } from "http";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.formData(); // ou JSON si tu changes backend
    const cookieStore = await cookies();
    const login = cookieStore.get('mail')?.value;
    const password = cookieStore.get('MDP')?.value;
    const credential = btoa(`${login}:${password}`);
    try {
        const resp = await fetch(`${process.env.BACKEND_API}/salaries/Modification/Salarie/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Basic ${credential}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(
                Object.fromEntries(body as any))
        });

        const text = await resp.text();
        console.log("credential: " + login)
        console.log("credential: " + password)
       return new NextResponse(text, { status: resp.status });
    }catch(ex){

        console.log(ex)
        return new NextResponse("erreur", { status: 500 });

    }
    
}
