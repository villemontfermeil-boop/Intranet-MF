import { NextResponse } from "next/server";


export async function POST(parm: Request) {

    const data = await parm.formData();
    const auth = parm.headers.get("Authorization");

    console.log("AUTH =", auth);

    if (!auth) {
        return new NextResponse("Missing token", { status: 401 });
    }

    try {
        const reponse = await fetch(`${process.env.BACKEND_API}/Article/upload`, {
            method: "POST",
            headers: {
                Authorization: auth
            },
            body: data
        });

        const text = await reponse.json();

        console.log("BACKEND STATUS =", reponse.status);
        console.log("BACKEND RESPONSE =", text);

        return new NextResponse(text, {
            status: reponse.status,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (e) {
        console.log("ERROR =", e);
        return new NextResponse("erreur", { status: 500 });
    }
}