import { randomBytes, createCipheriv, createDecipheriv, createHash } from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = createHash("sha256").update(process.env.PAYMENT_TOKEN_SECRET as string).digest();
const ivLength = 16;

export function encryptPaymentToken(payload: object): string {
  const iv = randomBytes(ivLength);
  const cipher = createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(JSON.stringify(payload), "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

export function decryptPaymentToken(token: string): any {
  const [ivHex, encrypted] = token.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = createDecipheriv(algorithm, secretKey, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
}
