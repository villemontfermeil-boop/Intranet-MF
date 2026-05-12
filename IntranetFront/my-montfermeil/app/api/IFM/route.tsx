import { NextResponse } from "next/server"


export async function GET(request: Request) {
  // Récupérer le token depuis les headers de la requête
  const authToken = request.headers.get('Authorization')

  if (!authToken || authToken === 'null') {
    return NextResponse.json("Pas autorisé", { status: 401 })

  }
  try {

    return NextResponse.json({ "clef": process.env.IDM_API_KEY }, { status: 201 })

  } catch (ex) {
    return NextResponse.json({ "érreur": ex }, { status: 201 })

  }


}