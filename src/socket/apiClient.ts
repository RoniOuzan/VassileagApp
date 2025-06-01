import { encrypt, decrypt } from "./Encryption";

const API_URL = "http://localhost:8000";

/**
 * Sends an encrypted request to the server and returns the decrypted response.
 * 
 * @param type - The message type, like "get_ligues"
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

        const encryptedResponse = await response.json();

        if (!encryptedResponse) {
            throw new Error("No encrypted data in server response");
        }

        return decrypt(encryptedResponse) as T;
    } catch (err) {
        console.error("API client error:", err);
        throw err;
    }
}
