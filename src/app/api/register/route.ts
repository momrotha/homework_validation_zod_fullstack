import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, email, password, confirmed_password } = body;
  try {
    
    const fetchData = await fetch(`${process.env.BASE_URL_PUBLIC_API}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmed_password,
        }),
      }
    );
    if (!fetchData.ok) {
      return NextResponse.json(
        { message: "Failed to register user" },
        { status: fetchData.status }
      );
    }

    const data = await fetchData.json();
    console.log("User registered successfully:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }
}
