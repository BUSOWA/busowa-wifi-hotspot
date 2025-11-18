// app/api/mtn/callback/route.js
export async function POST(request) {
  const body = await request.json();
  const { referenceId, status, financialTransactionId } = body;

  console.log("MTN Callback:", body);

  if (status === "SUCCESSFUL") {
    const transaction = global.mtnTransactions?.[referenceId];
    if (transaction) {
      // Generate voucher
      const voucher = generateVoucherCode(transaction.packageId);

      // Send via WhatsApp/SMS
      await fetch("/api/vouchers/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: transaction.phone, 
          username: voucher.username,
          code: voucher.code 
        }),
      });

      // Update status
      transaction.status = "COMPLETED";
      transaction.voucher = voucher.code;
      transaction.username = voucher.username;
    }
  }

  return Response.json({ received: true });
}

function generateVoucherCode(packageId) {
  const codes = {
    1: { hours: 8 },
    2: { hours: 24 },
    3: { hours: 48 },
  };
  // Generate username (e.g., BUSOWA1234)
  const username = "BUSOWA" + Math.random().toString(36).substring(2, 6).toUpperCase();
  // Generate password/voucher code (e.g., ABC123XY)
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  return { username, code, ...codes[packageId] };
}
