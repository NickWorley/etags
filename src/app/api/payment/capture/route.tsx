import { NextRequest, NextResponse } from "next/server";

const FORT_POINT_SECURITY_KEY = process.env.FORT_POINT_SECURITY_KEY;
const FORT_POINT_GATEWAY_URL = "https://secure.fppgateway.com/api/transact.php";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, amount } = body;

    if (!amount || !transactionId) {
      return NextResponse.json(
        { error: 'Missing amount -> ' + amount + ' or transactionid -> ' + transactionId },
        { status: 400 }
      );
    }

    const captureParams = new URLSearchParams();
    captureParams.append("type", "capture");
    captureParams.append("security_key", FORT_POINT_SECURITY_KEY || "");
    captureParams.append("transactionid", transactionId);
    captureParams.append("amount", amount);

    const capRes = await fetch(FORT_POINT_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: captureParams.toString(),
    });

    const capText = await capRes.text();
    const parsedCapRes = Object.fromEntries(
      new URLSearchParams(capText)
    );
    const responseCode = parseInt(parsedCapRes.response || "0", 10);
    const responseCodeValue = parseInt(
      parsedCapRes.response_code || "0",
      10
    );

    let success = false;
    let statusMessage = "Unknown response";

    if (responseCode === 1 && responseCodeValue === 100) {
      success = true;
      statusMessage = "Transaction approved and coverage setup";
    } else if (responseCode === 2) {
      statusMessage = "Transaction ID incorrect or payment amount over original charge";
    } else if (responseCode === 3) {
      statusMessage = "System error during finalizing";
    }

    return NextResponse.json({
      success,
      response: parsedCapRes.response,
      response_code: parsedCapRes.response_code,
      transactionid: parsedCapRes.transactionid,
      statusMessage,
    });

  } catch (error) {
    console.error("Payment finalization error:", error);
    return NextResponse.json(
      { error: "Internal server error while finalizing payment through FortPoint" },
      { status: 500 }
    );
  }
}