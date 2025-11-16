// app/api/mtn/initiate/route.js
import { v4 as uuidv4 } from "uuid";

const MTN_API_URL = "https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay";
const SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY; // Set in .env.local
const CALLBACK_HOST = process.env.VERCEL_URL || "http://localhost:3000";

export async function POST(request) {
  const { phone, amount, packageId } = await request.json();

  // Validate phone (MTN Uganda: 077x, 078x)
  if (!/^256(77|78)\d{7}$/.test(phone)) {
    return Response.json({ success: false, error: "Invalid MTN number" }, { status: 400 });
  }

  const externalId = uuidv4();
  const payload = {
    amount: amount.toString(),
    currency: "UGX",
    externalId,
    payer: { partyIdType: "MSISDN", partyId: phone },
    payerMessage: `BUSOWA WIFI: ${packageId === 1 ? "8hrs" : packageId === 2 ? "24hrs" : "2 Days"} - UGX ${amount}`,
    payeeNote: "WiFi Hotspot Voucher",
  };

  try {
    const res = await fetch(MTN_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${await getAccessToken()}`,
        "X-Reference-Id": externalId,
        "X-Target-Environment": "sandbox", // Change to "uganda" in production
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("MTN API error");

    // Save transaction in DB (or memory for demo)
    global.mtnTransactions = global.mtnTransactions || {};
    global.mtnTransactions[externalId] = { phone, amount, packageId, status: "PENDING" };

    return Response.json({
      success: true,
      message: "Check your phone for MTN MoMo prompt!",
      transactionId: externalId,
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Helper: Get OAuth Token
async function getAccessToken() {
  const tokenUrl = "https://proxy.momoapi.mtn.com/collection/token/";
  const apiKey = process.env.MTN_API_KEY; // Set in .env.local

  const auth = Buffer.from(`:${apiKey}`).toString("base64");

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
    },
  });

  const data = await res.json();
  return data.access_token;
}
