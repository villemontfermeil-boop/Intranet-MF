import { request } from "http";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const body = await req.formData(); // ou JSON si tu changes backend
    const login = cookieStore.get('mail');
    const password = cookieStore.get('MDP');
    const credential = btoa(`${login}:${password}`);

    const resp = await fetch(`${process.env.BACKEND_API}/salaries/Modification/Salarie/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Basic ${credential}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(Object.fromEntries(body as any))
    });

    const text = await resp.text();
    return new NextResponse(text, { status: resp.status });
}
