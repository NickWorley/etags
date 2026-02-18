import { NextRequest, NextResponse } from "next/server";

const FORT_POINT_SECURITY_KEY = process.env.FORT_POINT_SECURITY_KEY;
const FORT_POINT_GATEWAY_URL = "https://secure.fppgateway.com/api/transact.php";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, tokenType, card, amount, customerInfo } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Missing required field: amount" },
        { status: 400 }
      );
    }

    if (!token && !card) {
      return NextResponse.json(
        { error: "Either token or card details are required" },
        { status: 400 }
      );
    }

    const formParams = new URLSearchParams();
    formParams.append("type", "auth");
    formParams.append("security_key", FORT_POINT_SECURITY_KEY || "");
    formParams.append("amount", String(amount));
    formParams.append("customer_receipt", "true");

    if (token) {
      formParams.append("payment_token", token);
    }

    if (card) {
      if (card.number) {
        formParams.append("ccnumber", card.number);
      }
      if (card.exp) {
        formParams.append("ccexp", card.exp);
      }
    }

    if (customerInfo) {
      formParams.append("first_name", customerInfo.firstName);
      formParams.append("last_name", customerInfo.lastName);
      formParams.append("address1", customerInfo.address.address1);
      formParams.append("city", customerInfo.address.city);
      formParams.append("state", customerInfo.address.state);
      formParams.append("zip", customerInfo.address.postalCode);
      formParams.append("country", customerInfo.address.countryCode);
      formParams.append("phone", customerInfo.phone);
      formParams.append("email", customerInfo.email);
    }

    const response = await fetch(FORT_POINT_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formParams.toString(),
    });

    const responseText = await response.text();
    const parsedResponse = Object.fromEntries(
      new URLSearchParams(responseText)
    );

    const responseCode = parseInt(parsedResponse.response || "0", 10);
    const responseCodeValue = parseInt(
      parsedResponse.response_code || "0",
      10
    );

    let success = false;
    let statusMessage = "Unknown response";

    if (responseCode === 1 && responseCodeValue === 100) {
      success = true;
      statusMessage = "Transaction approved";
    } else if (responseCode === 2) {
      statusMessage = "Transaction declined";
    } else if (responseCode === 3) {
      statusMessage = "System error during transaction processing";
    }

    return NextResponse.json({
      success,
      response: parsedResponse.response,
      response_code: parsedResponse.response_code,
      transactionid: parsedResponse.transactionid,
      statusMessage,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing payment" },
      { status: 500 }
    );
  }
}
