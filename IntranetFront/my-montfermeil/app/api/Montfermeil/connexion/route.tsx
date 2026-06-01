import { NextResponse } from "next/server"


export async function GET(request: Request) {
  // Récupérer le token depuis les headers de la requête
  const authToken = request.headers.get('authorization')

  if (!authToken || authToken === 'null') {
    return NextResponse.json("Pas autorisé", { status: 401 })

  }
  try {
    const backendApi = process.env.BACKEND_NEW_API;
    console.log('BACKEND_API ->', backendApi);

    return NextResponse.json({ api: backendApi }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ erreur: ex }, { status: 500 });
  }


}