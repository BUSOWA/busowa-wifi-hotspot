// app/api/vouchers/send/route.js
export async function POST(request) {
  const { phone, code } = await request.json();

  // TODO: Send via WhatsApp/SMS
  console.log("Sending voucher to", phone, ":", code);

  return Response.json({ sent: true });
}
