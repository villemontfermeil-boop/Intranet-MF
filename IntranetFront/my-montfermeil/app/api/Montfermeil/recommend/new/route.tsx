import { NextResponse } from "next/server";





export async function POST(request: Request) {

    const authHeader = request.headers.get("Authorization");
     const body = await request.formData();
    try {

        const data = await fetch(`${process.env.BACKEND_API}/recommander/nouveaux`, {
            method: "POST",
            headers: {
                Authorization: authHeader || ''

            },
            body: body
        })

        console.log("Les donner", data);
        const json = await data.json();
        return NextResponse.json(json, { status: 200 })

    } catch (ex) {

        console.log("Petit probleme", ex)
        return NextResponse.json(ex, { status: 500 })


    }

}