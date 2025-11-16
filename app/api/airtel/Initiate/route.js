// app/api/airtel/initiate/route.js
export async function POST(request) {
  const { phone, amount, packageId } = await request.json();

  // TODO: Call Airtel API
  console.log("Airtel Payment:", { phone, amount, packageId });

  return Response.json({
    success: true,
    message: "Payment request sent to " + phone,
    transactionId: "AIR" + Date.now(),
  });
}
