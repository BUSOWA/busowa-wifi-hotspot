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
        body: JSON.stringify({ phone: transaction.phone, code: voucher.code }),
      });

      // Update status
      transaction.status = "COMPLETED";
      transaction.voucher = voucher.code;
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
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  return { code, ...codes[packageId] };
}
