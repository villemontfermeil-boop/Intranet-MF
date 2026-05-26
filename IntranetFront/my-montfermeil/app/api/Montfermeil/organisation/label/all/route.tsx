import { NextResponse } from "next/server";


export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');

    try {
        const data = await fetch(`${process.env.BACKEND_API}/Organisme/organigramme`, {
            method: "GET",
            headers: {
                Authorization: authHeader || ''
            }
        })

        const json = await data.json();
        console.log(json);

        return NextResponse.json(json, { status: data.status });
    } catch (ex) {

        console.log(ex)
        return NextResponse.json("Une erreur est survenue", { status: 500 });

    }
}