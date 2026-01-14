import { NextResponse } from "next/server";

export async function GET() {
        try {
            const response = await fetch(`${process.env.BACKEND_API}/Article/getArticle`);
            const json = await response.json();
            console.log(json); // Vérifie le JSON reçu
            return NextResponse.json(json);
        } catch (error) {
            return NextResponse.json({ error: 'Error fetching articles' }, { status: 500 });
        }
    }