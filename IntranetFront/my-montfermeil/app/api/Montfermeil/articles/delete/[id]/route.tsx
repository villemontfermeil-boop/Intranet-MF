import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Context = {

    params: {
        id: string

    };
};
export async function DELETE(request: Request, context: any) {
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params || {};
    const id = params?.id;
    const formData = await request.text();

    const auth = request.headers.get("Authorization");

    if (!id || id === "undefined") {
        console.warn('[api-test] missing or invalid id param', id);
        return NextResponse.json({ error: 'Missing or invalid id parameter' }, { status: 404 });
    }

    try {
        const reponse = await fetch(`${process.env.BACKEND_API}/Article/deleteArticle/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': auth || '',
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        })
        const json = await reponse.text()
        console.log("Il y'a ", reponse)
        console.log("Lecred : ", formData)
        return new NextResponse(json, { status: 200 })
    } catch (ex) {
        console.log(ex)
        return new NextResponse("Erreur", { status: 500 })

    }
}