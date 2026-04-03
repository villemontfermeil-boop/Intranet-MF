import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    const { email, password } = await req.json();

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);
    try {
        const data = await fetch(`${process.env.BACKEND_API}/Oublie/modifier/motdepasse`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });
        const json = await data.json();
    return NextResponse.json(json, {status: 200})
    } catch (ex) {
        console.log(ex);
        return NextResponse.json(ex, {status:500})
    }
} 