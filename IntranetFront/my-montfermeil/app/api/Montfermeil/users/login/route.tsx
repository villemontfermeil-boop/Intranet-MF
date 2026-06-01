import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const user = await request.formData();
    try {
        const response =await  fetch(`${process.env.BACKEND_API}/salaries/login`, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer intranetMF-token',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(
                Object.fromEntries(user as any)
            )
        })
        const data = await response.json();
        console.log(data)
        console.log(request)
        return NextResponse.json(data, { status: 200 })
    } catch (error) {
    console.log("ALORS: "+ error);
    const message = error instanceof Error ? error.message : "Une erreur est survenue";
    return new NextResponse(message, { status: 401 });
}
}