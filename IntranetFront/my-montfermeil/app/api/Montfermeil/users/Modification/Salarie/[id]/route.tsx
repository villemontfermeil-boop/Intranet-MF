import { request } from "http";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.formData(); // ou JSON si tu changes backend
    try {
        const resp = await fetch(`${process.env.BACKEND_API}/salaries/Modification/Salarie/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(
                Object.fromEntries(body as any))
        });

        const text = await resp.text();
       return new NextResponse(text, { status: resp.status });
    }catch(ex){

        console.log(ex)
        return new NextResponse("erreur", { status: 500 });

    }
    
}
