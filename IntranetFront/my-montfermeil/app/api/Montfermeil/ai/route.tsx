import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const auth = request.headers.get("Authorization");
    const body = await request.formData();
    const prompt = body.get("prompt");

    if(!auth || auth == null){
        return NextResponse.error();
    }
    const response = await fetch(`${process.env.BACKEND_API}/ai/ask`,
        {
            method: "POST",
            headers: {
                'Authorization': auth || ''
            },
            body: prompt?.toString()
        }
    );

    try {
        const json = await response.text();
        console.log(json); // Vérifie le JSON reçu
        return NextResponse.json(json);
    } catch (error) {
        console.log(response)
        return NextResponse.json({ error: 'Error lors de la demande' }, { status: 500 });
    }
}