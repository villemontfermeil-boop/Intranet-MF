import { NextResponse } from "next/server"


export async function GET(request: Request) {
  const keycloak = process.env.NEXT_KEYCLOAK;
  const realm = process.env.KEYCLOAK_REALM;
  const client = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;


    return NextResponse.json({"keycloak": keycloak , "realm" : realm,"client" : client }, {status: 201})
}