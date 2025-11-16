// app/api/vouchers/generate/route.js
import { randomBytes } from "crypto";

export async function GET() {
  const code = randomBytes(6).toString("hex").toUpperCase().slice(0, 12);
  const hours = 8; // default

  // TODO: Save to DB

  return Response.json({ code, hours, expiresAt: new Date(Date.now() + hours * 3600000) });
}
