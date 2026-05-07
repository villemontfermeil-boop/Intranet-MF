import { NextResponse } from "next/server"


export async function GET(request: Request) {
  // Récupérer le token depuis les headers de la requête
  const authToken = request.headers.get('authorization')

  if (!authToken || authToken === 'null') {
    return NextResponse.json("Pas autorisé", { status: 401 })

  }
  try {
    console.log(process.env.BACKEND_API)

    return NextResponse.json({ "api": process.env.BACKEND_API }, { status: 201 })

  } catch (ex) {
    return NextResponse.json({ "érreur": ex }, { status: 201 })

  }


}