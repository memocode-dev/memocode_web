export function generateRandomString(): string {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

export function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

export async function base64UrlEncode(data: ArrayBuffer): Promise<string> {
    const stringRepresentation = Array.from(new Uint8Array(data)).map(byte => String.fromCharCode(byte)).join('');
    return btoa(stringRepresentation)
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export async function generateVerifierAndChallenge(): Promise<{ verifier: string, challenge: string }> {
    const verifier = generateRandomString();
    const challengeBuffer = await sha256(verifier);
    const challenge = await base64UrlEncode(challengeBuffer);
    return {verifier, challenge};
}
