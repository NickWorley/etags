import { NextRequest, NextResponse } from "next/server";
import { getAutoAccessToken } from "@/lib/pcrs-auth";

const PCRS_AUTO_API_URL = process.env.PCRS_AUTO_API_URL;
const DEALER_NUMBER_AUTO = process.env.DEALER_NUMBER_AUTO;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleYear, make, model, vin, mileage } = body;

    if (!vehicleYear || !make || !model || !vin || mileage === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: vehicleYear, make, model, vin, mileage" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    const payload = {
      saleDate: today,
      dealerNumber: DEALER_NUMBER_AUTO,
      saleOdometer: mileage,
      vehicle: {
        vehicleYear,
        make,
        model,
        vin,
        vehicleAgeType: mileage > 0 ? "Used" : "New",
      },
    };

    const accessToken = await getAutoAccessToken();

    const response = await fetch(
      `${PCRS_AUTO_API_URL}/contracts/GetCoverageRates`,
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
        { error: "Failed to fetch coverage rates", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Coverage rates error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error while fetching coverage rates", message },
      { status: 500 }
    );
  }
}
