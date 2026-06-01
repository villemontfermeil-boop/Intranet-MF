import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Context = {
  params: {
    id: string;
  };
};
 export async function GET(context: any) {
const backendUrl = process.env.BACKEND_API;
        const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params || {};
        const  image = params?.image;
        if (!image || image === 'undefined') {
            console.warn('[api-test] missing or invalid id param', image);
            return NextResponse.json({ error: 'Missing or invalid id parameter' }, { status: 400 });
        }

        const cookiestore = await cookies();
        const login = cookiestore.get('mail')?.value || "";
        const password = cookiestore.get('MDP')?.value || "";
        const credential = btoa(`${login}:${password}`);

        try{
            const backendApi = backendUrl?.endsWith('/') ? backendUrl : `${backendUrl}/`;
            const reponse = await fetch(`${backendApi}uploads/Photos/${image}`, {
                headers:{
                    Authorization: `Basic ${credential}`
                }
            })
            const json = await reponse.json();
            console.log(json);
            return NextResponse.json(json, {status: 200});
            
        }catch(e){
            console.log(e)
            return NextResponse.json("Une Érreur c'est produits", {status: 500});

        }
        
    }