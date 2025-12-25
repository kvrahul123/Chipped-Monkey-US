import axios from "axios";
import { generateIdempotencyKey } from "./common";

export async function initializeHelcimSubscription(payload: {
  dateActivated: string; // "YYYY-MM-DD"
  paymentPlanId: number;
  customerCode: string;
  recurringAmount: number;
  useCustomSetupAmount?: boolean;
  setupAmount?: number;
  withFreeTrialPeriod?: boolean;
  maxCycles?: number; // optional, omit if not used
  paymentMethod: "card" | "bank";
}) {
  const idempotencyKey = generateIdempotencyKey(); // exactly 25 chars

  // Build subscription object carefully
  const subscription: any = {
    dateActivated: payload.dateActivated,
    paymentPlanId: payload.paymentPlanId,
    customerCode: payload.customerCode,
    recurringAmount: payload.recurringAmount,
    paymentMethod: payload.paymentMethod,
  };

  if (payload.useCustomSetupAmount) {
    subscription.useCustomSetupAmount = true;
    subscription.setupAmount = payload.setupAmount ?? 0;
  }

  if (payload.withFreeTrialPeriod !== undefined) {
    subscription.withFreeTrialPeriod = payload.withFreeTrialPeriod;
  }

  if (payload.maxCycles !== undefined) {
    subscription.maxCycles = payload.maxCycles;
  }

  const requestBody = { subscriptions: [subscription] };

  const response = await axios.post(
    "https://api.helcim.com/v2/subscriptions",
    requestBody,
    {
      headers: {
        "api-token": process.env.HELCIM_API_TOKEN!,
        "Content-Type": "application/json",
        "idempotency-key": idempotencyKey,
      },
    }
  );

  return response.data;
}
