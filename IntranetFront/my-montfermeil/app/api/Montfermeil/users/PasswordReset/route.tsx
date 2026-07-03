
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
    const cookieStore = await cookies();
    const body = await req.formData();
    try {
        const response = await fetch(`${process.env.BACKEND_API}/salaries/PasswordReset`, {
            method: "PATCH",
            headers: {
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