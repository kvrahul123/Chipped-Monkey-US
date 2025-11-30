import crypto from "crypto";

export function decryptOpayoData(crypt: string, password: string): Record<string, string> {
  if (!crypt) throw new Error("Crypt data is empty");
  if (crypt.startsWith("@")) crypt = crypt.substring(1);

  const key = Buffer.from(password, "utf8").slice(0, 16);
  const iv = key;

  let decrypted: string;
  try {
    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    decrypted = decipher.update(crypt, "hex", "utf8");
    decrypted += decipher.final("utf8");
  } catch (err) {
    console.error("❌ Invalid IV or decryption error:", err);
    throw err;
  }

  const result: Record<string, string> = {};
  decrypted.split("&").forEach((pair) => {
    const [k, v] = pair.split("=");
    if (k) result[k] = v ?? "";
  });

  return result;
}

export function encryptOpayoData(data: string, password: string): string {
  const key = Buffer.from(password.substring(0, 16), "utf8");
  const iv = Buffer.from(password.substring(0, 16), "utf8");

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  cipher.setAutoPadding(true);

  const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);

  return "@" + encrypted.toString("hex").toUpperCase();
}
