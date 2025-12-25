import axios from "axios";

interface PaymentParams {
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export const initializeHelcimPayment = async (params: PaymentParams) => {
  try {
    const res = await axios.post(
      `${process.env.HELCIM_API_URL}/helcim-pay/initialize`,
      {
        amount: params.amount,
        currency: params.currency,
        paymentType: "purchase",
        terminalId: process.env.HELCIM_TERMINAL_ID || "97374",
        returnUrl: params.returnUrl,
        cancelUrl: params.cancelUrl,
      },
      {
        headers: {
          "api-token": process.env.HELCIM_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.checkoutToken;
  } catch (error) {
    console.error("Helcim payment initialization failed:", error);
    throw new Error("Payment initialization failed");
  }
};
