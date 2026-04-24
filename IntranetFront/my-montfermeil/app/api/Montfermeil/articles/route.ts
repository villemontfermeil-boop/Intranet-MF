import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("ARTICLES API CALL - BACKEND_API:", process.env.BACKEND_API);
        
        const response = await fetch(`${process.env.BACKEND_API}/articles`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("BACKEND ARTICLES ERROR:", response.status, errorText);
            return new NextResponse(
                JSON.stringify({ error: `Backend error: ${response.status}`, details: errorText }), 
                { status: response.status, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const data = await response.json();
        console.log("ARTICLES SUCCESS:", data);
        
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("ARTICLES ROUTE ERROR:", error);
        const message = error instanceof Error ? error.message : "Erreur serveur";
        return new NextResponse(
            JSON.stringify({ 
                error: message,
                details: "Vérifiez que le backend est démarré sur http://localhost:8080"
            }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
