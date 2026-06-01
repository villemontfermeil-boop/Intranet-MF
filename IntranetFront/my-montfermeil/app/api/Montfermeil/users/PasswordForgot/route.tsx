import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const { email, password } = await req.json();

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);
    try {


        const data2 = await fetch(`${process.env.BACKEND_API}/Oublie/motDePasse`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        });

        if (data2.ok) {
            const responseData = await data2.json();
            return Response.json(responseData, { status: 200 });
        } else {

            const errorText = await data2.text();
            return Response.json({ error: errorText }, { status: data2.status });
        }

    } catch (ex) {
        console.log(ex);
        return Response.json({ error: ex }, { status: 500 });
    }
}


