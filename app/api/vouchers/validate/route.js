// app/api/vouchers/validate/route.js
export async function POST(request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return Response.json({ 
      valid: false, 
      error: "Username and password are required" 
    }, { status: 400 });
  }

  // Search in MTN transactions
  for (const [transactionId, transaction] of Object.entries(global.mtnTransactions || {})) {
    if (
      transaction.username === username && 
      transaction.voucher === password &&
      transaction.status === "COMPLETED"
    ) {
      return Response.json({
        valid: true,
        message: "Credentials validated successfully",
        transactionId,
        packageId: transaction.packageId,
      });
    }
  }

  // Search in Airtel transactions
  for (const [transactionId, transaction] of Object.entries(global.airtelTransactions || {})) {
    if (
      transaction.username === username && 
      transaction.voucher === password &&
      transaction.status === "COMPLETED"
    ) {
      return Response.json({
        valid: true,
        message: "Credentials validated successfully",
        transactionId,
        packageId: transaction.packageId,
      });
    }
  }

  return Response.json({ 
    valid: false, 
    error: "Invalid username or password" 
  }, { status: 401 });
}

