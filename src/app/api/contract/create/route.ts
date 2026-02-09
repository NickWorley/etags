import { NextRequest, NextResponse } from "next/server";
import { getAutoAccessToken } from "@/lib/pcrs-auth";

const PCRS_AUTO_API_URL = process.env.PCRS_AUTO_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contracts } = body;

    if (!Array.isArray(contracts) || contracts.length === 0) {
      return NextResponse.json(
        { error: "Missing or empty contracts array" },
        { status: 400 }
      );
    }

    const accessToken = await getAutoAccessToken();

    const results = await Promise.all(
      contracts.map(async (contractPayload, index) => {
        try {
          const response = await fetch(
            `${PCRS_AUTO_API_URL}/contracts/AddOrUpdate`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(contractPayload),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            return {
              index,
              success: false,
              status: response.status,
              error: data,
            };
          }

          return {
            index,
            success: true,
            data,
          };
        } catch (err) {
          return {
            index,
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
          };
        }
      })
    );

    const allSucceeded = results.every((r) => r.success);

    return NextResponse.json(
      { results },
      { status: allSucceeded ? 200 : 207 }
    );
  } catch (error) {
    console.error("Contract creation error:", error);
    return NextResponse.json(
      { error: "Internal server error while creating contracts" },
      { status: 500 }
    );
  }
}
