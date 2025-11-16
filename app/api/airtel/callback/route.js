// app/api/airtel/callback/route.js
export async function POST(request) {
  const body = await request.json();
  console.log("Airtel Callback:", body);

  // TODO: Validate payment, generate voucher, call /api/vouchers/send

  return Response.json({ received: true });
}
