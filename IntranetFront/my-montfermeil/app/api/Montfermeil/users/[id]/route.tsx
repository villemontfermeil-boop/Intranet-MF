import { NextResponse } from "next/server";
type Context = {
  params: {
    id: string;
  };
};
const backendUrl = process.env.BACKEND_API;

export async function GET(request: Request, context: any) {
  // support both Promise params (when framework provides) and plain object
  const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params || {};
  const id = params?.id;
  console.log('[api-test] fetching user id=', id);
  if (!id || id === 'undefined') {
    console.warn('[api-test] missing or invalid id param', id);
    return NextResponse.json({ error: 'Missing or invalid id parameter' }, { status: 400 });
  }
    try {
        const auth = request.headers.get("Authorization");
        
        const resp = await fetch(`${process.env.BACKEND_API}/salaries/${id}`, { 
          headers:{
            Authorization : auth || ''
          }
         });

        const text = await resp.json();
         console.log(text)
        return NextResponse.json(text, {status : 200})
    }catch(ex){
      console.log("érreur",ex)
      return NextResponse.json(ex, {status: 500})
    }
}
