import { NextResponse } from "next/server";

export async function GET(request : Request) {
    const auth = request.headers.get("Authorization");

    const response = await fetch(`${process.env.BACKEND_API}/Article/getArticle`,
        {
            headers: {
                'Authorization': auth || ''
            }
        }
    );

    try {
        const json = await response.json();
        console.log(json); // Vérifie le JSON reçu
        return NextResponse.json(json);
    } catch (error) {
        console.log(response)
        return NextResponse.json({ error: 'Error fetching articles' }, { status: 500 });
    }
}