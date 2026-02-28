import { NextRequest, NextResponse } from "next/server";
import { getHomeAccessToken } from "@/lib/pcrs-auth";

const PCRS_HOME_API_URL = process.env.PCRS_HOME_API_URL;
const DEALER_NUMBER_HOME = process.env.DEALER_NUMBER_HOME;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { homeDetails, customer } = body;

    if (!homeDetails || !customer) {
      return NextResponse.json(
        { error: "Missing required fields: homeDetails, customer" },
        { status: 400 }
      );
    }

    const { homeCoverageCode, lossCodes } = homeDetails;
    const { firstName, lastName, phone, email, address } = customer;

    if (!homeCoverageCode || !firstName || !lastName || !address) {
      return NextResponse.json(
        { error: "Missing required customer or coverage details" },
        { status: 400 }
      );
    }

    const additionalCoverage = Array.isArray(lossCodes)
      ? lossCodes.join(";")
      : lossCodes || "";


    const easternDate = new Date().toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const payload = {
      dealerNumber: DEALER_NUMBER_HOME,
      dealerInvoiceNumber: "C4C25",
      storeLocationNumber: "C4C25",
      status: "S",
      coverage: {
        warrantySKUCode: homeCoverageCode,
        additionalWarranty: additionalCoverage,
      },
      customer: {
        firstName,
        lastName,
        address: {
          address1: address.address1,
          city: address.city,
          state: address.state,
          zipCode: address.postalCode,
          country: address.countryCode,
        },
        contact: {
          phone: {
            mainPhone: phone,
          },
          email,
        },
      },
      transactionDate: easternDate,
      products: [
        {
          productPurchaseDate: easternDate
        },
      ],
    };

    const accessToken = await getHomeAccessToken();

    const response = await fetch(
      `${PCRS_HOME_API_URL}/contracts/AddContract`,
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
        { error: "Failed to create home service contract", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Home contract creation error:", error);
    return NextResponse.json(
      { error: "Internal server error while creating home service contract" },
      { status: 500 }
    );
  }
}
