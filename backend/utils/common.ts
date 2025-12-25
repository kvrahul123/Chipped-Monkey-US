// common.ts
export function generateIdempotencyKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 25; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}
