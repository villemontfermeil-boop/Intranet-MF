import { NextResponse } from "next/server";


export async function GET(request: Request, context: any) {
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params || {};
    const id = params?.id;
    const auth = request.headers.get("Authorization");


    try {
        const data = await fetch(`${process.env.BACKEND_API}/Organisme/organigramme/${id}`, {
            method: "GET",
            headers: {
                Authorization: auth || ''
            }

        })

        const json = await data.json();
        console.log(json);

        return NextResponse.json(json, { status: 200 });
    } catch (ex) {

        console.log(ex)
        return NextResponse.json("Une erreur est survenue", { status: 500 });

    }
}