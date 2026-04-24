import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = body.email;

        console.log("LOGOUT REQUEST for email:", email);

        if (!email) {
            return new NextResponse(
                JSON.stringify({ error: "Missing email" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Call backend logout endpoint
        try {
            const backendUrl = `${process.env.BACKEND_API}/salaries/logout`;
            console.log("CALLING BACKEND LOGOUT:", backendUrl);

            const response = await fetch(backendUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    mail: email  // 🔥 IMPORTANT: backend expects "mail" not "email"
                })
            });

            console.log("LOGOUT RESPONSE STATUS:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Backend logout error:", response.status, errorText);
                return new NextResponse(
                    JSON.stringify({ error: `Backend error: ${response.status}`, details: errorText }),
                    { status: response.status, headers: { 'Content-Type': 'application/json' } }
                );
            }

            const data = await response.json();
            console.log("Backend logout success:", data);

            return NextResponse.json({ success: true, data }, { status: 200 });
        } catch (backendError) {
            console.error("Backend logout error (connection):", backendError);
            return new NextResponse(
                JSON.stringify({ error: "Backend unreachable", details: String(backendError) }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        console.error("LOGOUT ROUTE ERROR:", error);
        return new NextResponse(
            JSON.stringify({ error: "Logout failed" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

