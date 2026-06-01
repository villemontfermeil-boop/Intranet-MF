import { NextResponse } from "next/server";


export async function POST(request: Request, context: any) {
    const authHeader = request.headers.get('Authorization');
    const body = await request.formData()

    try {
        const data = await fetch(`${process.env.BACKEND_API}/telechargement/nouveaux/fichier`, {
            method: "POST",
            headers: {
                Authorization: authHeader || ''
            },
            body : body
        })
        // A TESTER SI SA MARCHE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        const json = await data.json();
        console.log(json);

        return NextResponse.json(json, { status: 200 });
    } catch (ex) {

        console.log(ex)
        return NextResponse.json("Une erreur est survenue", { status: 500 });

    }
}