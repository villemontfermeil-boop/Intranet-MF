import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params;   
  const cookieStore = await cookies();     
  const credential = cookieStore.get("credential")?.value;

  console.log("Fetching data for name =", name);
  console.log("credential =", credential);

  try {
    const response = await fetch(
      `${process.env.BACKEND_API}/salaries/Salarie/${encodeURIComponent(name)}`,
      {
        headers: {
          Authorization: `Basic ${credential}`
        }
      }
    );

    const json = await response.json();
    return NextResponse.json(json, { status: response.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}
