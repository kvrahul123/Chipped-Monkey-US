// HashData.tsx
import CryptoJS from "crypto-js";

// 🔐 AES Encryption
export const EncryptData = (data: string | number, secret: string): string => {
  return CryptoJS.AES.encrypt(String(data), secret).toString();
};

// 🔐 AES Decryption
export const DecryptData = (cipherText: string, secret: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};
