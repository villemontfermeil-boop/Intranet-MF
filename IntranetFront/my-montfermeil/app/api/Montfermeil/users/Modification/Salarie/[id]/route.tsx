import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const body = await req.formData(); // ou JSON si tu changes backend
    const login = sessionStorage.getItem('mail');
    const password = sessionStorage.getItem('MDP');
    const credential = btoa(`${login}:${password}`);

    const resp = await fetch(`http://localhost:8080/salaries/Modification/Salarie/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Basic ${credential}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(Object.fromEntries(body) as Record<string, string>).toString()
    });

    const text = await resp.text();
    return new NextResponse(text, { status: resp.status });
}
