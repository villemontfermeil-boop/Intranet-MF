
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
    const cookieStore = await cookies();
    const credential = cookieStore.get("credential")?.value || "";
    const body = await req.formData();
    console.log(body);
    try {
        const response = await fetch(`${process.env.BACKEND_API}/salaries/PasswordReset`, {
            method: "PATCH",
            headers: {
                "Authorization": `Basic ${credential}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(Object.fromEntries(body as any))
        })
        const json = await response.json();
       return NextResponse.json(json);
    }catch(e){
        return new NextResponse("Une érreur c'est produit", {status: 500})
    }

}