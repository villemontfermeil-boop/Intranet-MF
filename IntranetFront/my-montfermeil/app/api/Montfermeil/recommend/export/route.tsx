import { NextResponse } from "next/server";





export async function GET(request: Request) {

    const authHeader = request.headers.get("Authorization");
    try {

        const data = await fetch(`${process.env.BACKEND_API}/recommander/export/excel`, {
            method: "GET",
            headers: {
                Authorization: authHeader || ''

            }
        })

        console.log("Les donner", data);
        if (!data.ok) {
            return new Response("Erreur export", { status: 500 });
        }

        const buffer = await data.arrayBuffer();

        return new Response(buffer, {
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": "attachment; filename=export.xlsx"
            }
        });

    } catch (ex) {

        console.log("Petit probleme", ex)
        return NextResponse.json(ex, { status: 500 })


    }

}