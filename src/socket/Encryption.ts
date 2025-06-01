import CryptoJS from "crypto-js";

const KEY = CryptoJS.enc.Utf8.parse("mysecretkey12345");
const IV = CryptoJS.enc.Utf8.parse("0123456789abcdef");

export function encrypt(plaintext: string): string {
  const encrypted = CryptoJS.AES.encrypt(plaintext, KEY, {
    iv: IV,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return encrypted.toString(); // Base64
}

export function decrypt(ciphertext: string): string {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, KEY, {
    iv: IV,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
