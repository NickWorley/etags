import { NextRequest, NextResponse } from "next/server";
import { getAutoAccessToken } from "@/lib/pcrs-auth";

const PCRS_AUTO_API_URL = process.env.PCRS_AUTO_API_URL;

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const accessToken = await getAutoAccessToken();

    const response = await fetch(
      `${PCRS_AUTO_API_URL}/contracts/GetContractPreview`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch contract preview", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Contract preview error:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching contract preview" },
      { status: 500 }
    );
  }
}
