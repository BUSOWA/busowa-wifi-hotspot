// app/api/vouchers/status/route.js
export async function POST(request) {
  const { transactionId } = await request.json();

  if (!transactionId) {
    return Response.json({ success: false, error: "Transaction ID is required" }, { status: 400 });
  }

  // Check MTN transactions
  const mtnTransaction = global.mtnTransactions?.[transactionId];
  if (mtnTransaction) {
    return Response.json({
      success: true,
      status: mtnTransaction.status,
      hasVoucher: !!mtnTransaction.voucher,
      username: mtnTransaction.username,
      voucher: mtnTransaction.voucher,
      provider: "MTN",
    });
  }

  // Check Airtel transactions
  const airtelTransaction = global.airtelTransactions?.[transactionId];
  if (airtelTransaction) {
    return Response.json({
      success: true,
      status: airtelTransaction.status,
      hasVoucher: !!airtelTransaction.voucher,
      username: airtelTransaction.username,
      voucher: airtelTransaction.voucher,
      provider: "Airtel",
    });
  }

  return Response.json({ 
    success: false, 
    error: "Transaction not found" 
  }, { status: 404 });
}

