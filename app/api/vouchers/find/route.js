// app/api/vouchers/find/route.js
export async function POST(request) {
  const { transactionId } = await request.json();

  if (!transactionId) {
    return Response.json({ success: false, error: "Transaction ID is required" }, { status: 400 });
  }

  // Search in MTN transactions
  const mtnTransaction = global.mtnTransactions?.[transactionId];
  if (mtnTransaction && mtnTransaction.voucher) {
    return Response.json({
      success: true,
      username: mtnTransaction.username,
      voucher: mtnTransaction.voucher,
      packageId: mtnTransaction.packageId,
      phone: mtnTransaction.phone,
      amount: mtnTransaction.amount,
      status: mtnTransaction.status,
      provider: "MTN",
    });
  }

  // Search in Airtel transactions (if implemented)
  const airtelTransaction = global.airtelTransactions?.[transactionId];
  if (airtelTransaction && airtelTransaction.voucher) {
    return Response.json({
      success: true,
      username: airtelTransaction.username,
      voucher: airtelTransaction.voucher,
      packageId: airtelTransaction.packageId,
      phone: airtelTransaction.phone,
      amount: airtelTransaction.amount,
      status: airtelTransaction.status,
      provider: "Airtel",
    });
  }

  return Response.json({ 
    success: false, 
    error: "Transaction not found or voucher not yet generated. Please check your transaction ID or wait a moment if you just paid." 
  }, { status: 404 });
}

