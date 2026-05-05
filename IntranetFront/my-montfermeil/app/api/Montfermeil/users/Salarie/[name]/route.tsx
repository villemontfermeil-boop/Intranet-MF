import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params;
  const cookieStore = await cookies();
  const credential = cookieStore.get("credential")?.value;
  const authHeader = request.headers.get('authorization');
  console.log("Fetching data for name =", name);
  console.log("credential =", authHeader);

  try {
    const response = await fetch(
      `${process.env.BACKEND_API}/salaries/Salarie/${encodeURIComponent(name)}`,
      {
        headers: {
          Authorization: authHeader || ''
        }
      }
    );

    if (!response.ok) {
      console.error("Erreur API :", response.status);
      return NextResponse.json([], { status: response.status });
    }

    const json = await response.json();
    return NextResponse.json(json);

  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
