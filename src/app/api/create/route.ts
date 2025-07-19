import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Create car request body:", body);

    const {
      make,
      model,
      year,
      price,
      description,
      color,
      image,
    } = body;


    const authHeader = request.headers.get("authorization");
    let accessToken = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.substring(7); // Remove "Bearer " prefix
      console.log("Token found in Authorization header");
    } else {
      // Fallback to cookies
      accessToken = (await cookies()).get("accessToken")?.value;
      console.log("Token found in cookies:", accessToken ? "Yes" : "No");
    }

    if (!accessToken) {
      console.log("No access token found");
      return NextResponse.json(
        { message: "Unauthorized - No access token" },
        { status: 401 }
      );
    }

    console.log("Making request to external API...");

    const carBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!carBaseUrl) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return NextResponse.json(
        { message: "Server configuration error: NEXT_PUBLIC_API_URL is not defined" },
        { status: 500 }
      );
    }

    const fetchData = await fetch(`${carBaseUrl}/cars`, {
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

    if (!fetchData.ok) {
      const errorData = await fetchData.text();
      console.error("External API Error:", errorData);
      return NextResponse.json(
        {
          message: "Failed to create car",
          error: errorData,
        },
        {
          status: fetchData.status,
        }
      );
    }

    const result = await fetchData.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Create car error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}