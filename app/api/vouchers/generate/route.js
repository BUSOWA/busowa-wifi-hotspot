// app/api/vouchers/generate/route.js
import { randomBytes } from "crypto";

export async function GET() {
  // Generate username (e.g., BUSOWA1234)
  const username = "BUSOWA" + Math.random().toString(36).substring(2, 6).toUpperCase();
  // Generate password/voucher code
  const code = randomBytes(6).toString("hex").toUpperCase().slice(0, 12);
  const hours = 8; // default

  // TODO: Save to DB

  return Response.json({ 
    username,
    code, 
    hours, 
    expiresAt: new Date(Date.now() + hours * 3600000) 
  });
}
