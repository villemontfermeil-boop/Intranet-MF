import { NextResponse } from "next/server";





export async function GET(request: Request) {

    const authHeader = request.headers.get("Authorization");
    try {

        const data = await fetch(`${process.env.BACKEND_API}/recommander/recommander`, {
            method: "GET",
            headers: {
                Authorization: authHeader || ''

            }
        })

        console.log("Les donner", data);
        const json = await data.json();
        return NextResponse.json(json, { status: 200 })

    } catch (ex) {

        console.log("Petit probleme", ex)
        return NextResponse.json(ex, { status: 500 })


    }

}