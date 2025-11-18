// app/api/vouchers/send/route.js
export async function POST(request) {
  const { phone, username, code } = await request.json();

  // TODO: Send via WhatsApp/SMS
  const message = `BUSOWA WIFI HOTSPOT\n\nYour WiFi credentials:\nUsername: ${username}\nPassword: ${code}\n\nUse these to connect to the WiFi network.`;
  console.log("Sending voucher to", phone, ":", message);

  // In production, integrate with WhatsApp/SMS API here
  // Example: await fetch('https://api.whatsapp.com/send', {...})

  return Response.json({ sent: true });
}
