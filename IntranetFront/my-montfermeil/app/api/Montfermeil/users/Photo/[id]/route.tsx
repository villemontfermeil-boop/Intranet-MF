import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Context = {
  params: {
    id: string;
  };
};
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;


        const backendUrl = process.env.BACKEND_API;
      
        const cookiestore = await cookies();
        const login = cookiestore.get('mail')?.value || "";
        const password = cookiestore.get('MDP')?.value || "";
        const credential = btoa(`${login}:${password}`);

        try{
            const reponse = await fetch(`${backendUrl}/Photo/Profile/${id}`, {
                method : "GET",
                headers:{
                    "Authorization" : `Basic ${credential}` 
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