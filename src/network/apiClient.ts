import { encrypt, decrypt } from "./Encryption";

const API_URL = "http://192.168.1.73:3339";

/**
 * Sends an encrypted request to the server and returns the decrypted response.
 * 
 * @param type - The message type, like "get_leagues"
 * @param payload - Optional payload to include in the message
 */
export async function apiClient<T = any>(type: string, payload: Record<string, any> = {}): Promise<T> {
    try {
        const requestPayload = { type, ...payload };
        const encryptedData = encrypt(JSON.stringify(requestPayload));

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: encryptedData
        });

        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
        }

        const encryptedResponse = await response.text();

        if (!encryptedResponse) {
            throw new Error("No encrypted data in server response");
        }

        return JSON.parse(decrypt(encryptedResponse));
    } catch (err) {
        console.error("API client error:", err);
        throw err;
    }
}
