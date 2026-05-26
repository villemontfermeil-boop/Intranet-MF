import { NextResponse } from "next/server";


export async function DELETE(request: Request, context: any) {
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params || {};
    const id = params?.id;
    const authHeader = request.headers.get('Authorization');
console.log(id)
    try {
        const data = await fetch(`${process.env.BACKEND_API}/telechargement/organisme/supprimer/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: authHeader || ''
            }
        })

        const json = await data.text();
        console.log(json);

        return NextResponse.json(json, { status: 200 });
    } catch (ex) {

        console.log(ex)
        return NextResponse.json("Une erreur est survenue", { status: 500 });

    }
}