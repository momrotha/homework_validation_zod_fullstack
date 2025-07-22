import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Create car request body:", body);

    const { make, model, year, price, description, color, image } = body;

    const authHeader = request.headers.get("authorization");
    let accessToken = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.substring(7);
      console.log("Token found in Authorization header");
    } else {
      accessToken = cookies().get("accessToken")?.value;
      console.log("Token found in cookies:", accessToken ? "Yes" : "No");
    }

    if (!accessToken) {
      console.log("No access token found");
      return NextResponse.json(
        { message: "Unauthorized - No access token" },
        { status: 401 }
      );
    }

    const carBaseUrl = process.env.NEXT_PUBLIC_BASE_URL_PUBLIC_API;
    if (!carBaseUrl) {
      console.error("Missing env: NEXT_PUBLIC_BASE_URL_PUBLIC_API");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const res = await fetch(`${carBaseUrl}/cars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        make,
        model,
        year,
        price,
        description,
        color,
        image,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error:", errorText);
      return NextResponse.json(
        {
          message: "Failed to create car",
          error: errorText,
        },
        { status: res.status }
      );
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
