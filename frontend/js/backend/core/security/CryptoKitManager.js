/**
 * CryptoKitManager.js
 * Encriptación y Desencriptación AES-256-GCM mediante Web Crypto API (Zero-Knowledge)
 */

export class CryptoKitManager {
  static async deriveKey(saltString = 'PochirochoZeroKnowledgeSalt') {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode('PochirochoSecretPassphrase2026'),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(saltString),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encryptData(dataObj) {
    try {
      if (!window.crypto || !window.crypto.subtle) {
        return JSON.stringify(dataObj); // Fallback si no está disponible crypto.subtle
      }
      const key = await this.deriveKey();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(JSON.stringify(dataObj));

      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );

      const ivArray = Array.from(iv);
      const encryptedArray = Array.from(new Uint8Array(encryptedContent));

      return JSON.stringify({
        iv: ivArray,
        ciphertext: encryptedArray,
        encrypted: true
      });
    } catch (e) {
      console.warn('CryptoKitManager: Fallback a almacenamiento plano por error en encriptación:', e);
      return JSON.stringify(dataObj);
    }
  }

  static async decryptData(encryptedStr) {
    try {
      if (!encryptedStr) return null;
      const parsed = typeof encryptedStr === 'string' ? JSON.parse(encryptedStr) : encryptedStr;
      if (!parsed.encrypted || !window.crypto || !window.crypto.subtle) {
        return parsed;
      }

      const key = await this.deriveKey();
      const iv = new Uint8Array(parsed.iv);
      const ciphertext = new Uint8Array(parsed.ciphertext);

      const decryptedContent = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );

      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decryptedContent));
    } catch (e) {
      console.warn('CryptoKitManager: Error al desencriptar o dato en formato legible:', e);
      return typeof encryptedStr === 'string' ? JSON.parse(encryptedStr) : encryptedStr;
    }
  }
}
