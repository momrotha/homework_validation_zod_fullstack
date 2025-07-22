
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
    
  const body = await request.json();
  const {email, password} = body;
  try {
    const fetchData = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_PUBLIC_API}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
      }
    );
    if (!fetchData.ok) {
      return NextResponse.json(
        { message: "Failed to login user" },
        { status: fetchData.status }
      );
    }

    const data = await fetchData.json();
    console.log("User login successfully:", data);
    // set cookie
    const cookieStore = cookies();
    const cookieName = "refreshToken";
    const refreshToken = data.refresh_token;

    // set cookie with refresh token
    await (await cookieStore).set({
        name: cookieName,
        value: refreshToken,
        sameSite:"lax",
        httpOnly: true,
        secure:true
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }
}
