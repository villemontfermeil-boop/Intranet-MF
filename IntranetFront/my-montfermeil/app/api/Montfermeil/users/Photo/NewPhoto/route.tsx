import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
    const req = await request.formData();
    const backend = process.env.BACKEND_API;
    const cookis = await cookies();
    const login = cookis.get('mail')?.value || "";
    const password = cookis.get('MDP')?.value || "";
    const credential = btoa(`${login}:${password}`);
    try {


        const api = await fetch(`${backend}/Photo/Nouveaux`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credential}`,
            },
            body: req
        });

        if (!api.ok) {
            const errorText = await api.text();

            try {


                console.log("URL Backend:", `${backend}/Photo/Modifier`);
                console.log("ID envoyé:", req.get("id"));
                console.log("Fichier envoyé:", req.get("file") ? "Présent" : "Absent");

                const api = await fetch(`${backend}/Photo/Modifier`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Basic ${credential}`,
                    },
                    body: req
                });

                if (!api.ok) {
                    const errorText = await api.text();
                    console.log("Erreur backend:", api.status, errorText);
                    console.log("crédential :" + credential);
                    return NextResponse.json({ error: errorText }, { status: api.status });
                }

                const responseData = await api.text();
                return NextResponse.json(responseData, { status: 200 });

            } catch (ex) {
                console.error("Erreur complète:", ex);
                return NextResponse.json({ error: String(ex) }, { status: 500 });
            }

           
        }

        const responseData = await api.text();
        return NextResponse.json(responseData, { status: 200 });

    } catch (ex) {

        console.log(ex)

    }

}