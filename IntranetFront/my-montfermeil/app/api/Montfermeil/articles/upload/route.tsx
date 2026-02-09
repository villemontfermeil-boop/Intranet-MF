import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(parm: Request) {

    const data = await parm.formData();
    const cookieStore = await cookies();
    const credential = cookieStore.get("credential")?.value || ""
    try{ 
        const reponse = await fetch(`http://localhost:8080/Article/upload`, {
                method: "POST",
                headers: {
                    'Authorization': `Basic ${credential}`
                },
                body:  data
            })

        const json = await reponse.json();
        return  NextResponse.json(json);
        }catch(e){
            return new NextResponse("erreur ",{status: 500})
        }
}