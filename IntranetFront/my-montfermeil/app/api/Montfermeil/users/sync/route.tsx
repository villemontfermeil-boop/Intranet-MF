import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        console.log("SYNC REQUEST BODY:", body);
        
        const authHeader = request.headers.get('Authorization');
        
        if (!body.email) {
            return new NextResponse(
                JSON.stringify({ error: "Missing email in body" }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        console.log(body)
        
        // Appel au nouveau endpoint /auth/sync (PUBLIC - pas d'auth requise)
        const backendUrl = `${process.env.BACKEND_API}/auth/sync`;
        console.log("CALLING BACKEND:", backendUrl);
        
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("BACKEND SYNC ERROR:", response.status, errorText);
            return new NextResponse(
                JSON.stringify({ error: `Backend error: ${response.status}`, details: errorText }), 
                { status: response.status, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const data = await response.json();
        console.log("SYNC SUCCESS:", data);
        
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("SYNC ROUTE ERROR:", error);
        const message = error instanceof Error ? error.message : "Erreur serveur";
        return new NextResponse(
            JSON.stringify({ 
                error: message,
                details: "Vérifiez que le backend est démarré"
            }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
