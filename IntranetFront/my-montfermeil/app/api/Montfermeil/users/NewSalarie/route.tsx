import { Console } from "console";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const credential = cookieStore.get("credential")?.value || "";

    // Exemple : tu récupères les champs depuis la page ou formulaire
    const formData = await req.formData();
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
        params.append(key, value.toString());
    });
    if(cookieStore.get("Admin")){

    
    try {
        const response = await fetch(`${process.env.BACKEND_API}/salaries/NewSalarie`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${credential}`,
            },
            body: params,
        });

        const result = await response.text(); // ou json si backend renvoie JSON
        console.log("Réponse backend :", result);
        console.log("PARAM:", formData
        )
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}else{
    return NextResponse.json("Not Allowed", {status: 401})
}
}
