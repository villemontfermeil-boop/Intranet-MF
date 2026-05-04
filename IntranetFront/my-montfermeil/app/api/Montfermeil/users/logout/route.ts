import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const body = await request.formData();
    const backendUrl = `${process.env.BACKEND_API}/salaries/logout`;


    try {
        const logout = await fetch(backendUrl, {
            method: "POST",
            body: body
        })


        const json = await logout.json();
        console.log(json)

    return NextResponse.json(json, { status: 200 });

    } catch (ex) {
        console.log("LOGOUT REQUEST for email:", body);
       
    return new NextResponse("une erreur est survenue", { status: 500 });


    }




}

