import { NextRequest, NextResponse } from "next/server";

const FORT_POINT_SECURITY_KEY = process.env.FORT_POINT_SECURITY_KEY;
const FORT_POINT_GATEWAY_URL = "https://secure.fppgateway.com/api/transact.php";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: "Missing transaction id" },
        { status: 400 }
      );
    }

    const cancelParams = new URLSearchParams();
    cancelParams.append("type", "void");
    cancelParams.append("security_key", FORT_POINT_SECURITY_KEY || "");
    cancelParams.append("transactionid", transactionId);

    const response = await fetch(FORT_POINT_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: cancelParams.toString(),
    });

    const resText = await response.text();

    const parsedResp = Object.fromEntries(
      new URLSearchParams(resText)
    );

    const respCode = parseInt(parsedResp.response || "0", 10);
    const respCodeVal = parseInt(
      parsedResp.response_code || "0",
      10
    );

    let success = false;
    let statusMessage = "Unknown response";

    if (respCode === 1 && respCodeVal === 100) {
      success = true;
      statusMessage = "Transaction successfully voided. No charge/statement will appear on your payment method.";
    } else if (respCode === 2) {
      statusMessage = "Transaction failed to void. No charge has gone through with your payment, but please contract support immediately to successfully void your payment.";
    } else if (respCode === 3) {
      statusMessage = "System error during transaction void. No charge will appear on your payment.";
    }

    return NextResponse.json({
      success,
      response: parsedResp.response,
      response_code: parsedResp.response_code,
      transactionid: parsedResp.transactionid,
      statusMessage,
    });

  } catch (error) {
    console.error("Failed to void customer contract:", error);
    return NextResponse.json(
      { error: "Internal server error while voiding Fort Point payment" },
      { status: 500 }
    );
  }
}