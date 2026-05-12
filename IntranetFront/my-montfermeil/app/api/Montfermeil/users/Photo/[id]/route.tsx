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
      
        const auth = request.headers.get("Authorization")

        try{
            const reponse = await fetch(`${backendUrl}/Photo/Profile/${id}`, {
                method : "GET",
                headers:{
                    Authorization : auth || ''
                } 
            })
            const json = await reponse.json();
            console.log("Lejson", json);
            return NextResponse.json(json, {status: reponse.status});
            
        }catch(e){
            console.log("GROS PROBLEME",e)
            return NextResponse.json("Une Érreur c'est produits", {status: 500});

        }
        
    }