import twilio from "twilio";

export const sendWhatsApp = async (to: string, message: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !from) {
    throw new Error("Twilio credentials are missing");
  }

  const client = twilio(accountSid, authToken);

  return await client.messages.create({
    body: message,
    from: `whatsapp:${from}`,
    to: `whatsapp:${to}`,
  });
};
