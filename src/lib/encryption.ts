import CryptoJS from 'crypto-js';

export type Algorithm = 'caesar' | 'vigenere' | 'reverse' | 'xor' | 'base64' | 'aes' | 'rsa';

export interface EncryptionResult {
  output: string;
  success: boolean;
  error?: string;
}

// Caesar Cipher
export function caesarEncrypt(text: string, shift: number): EncryptionResult {
  try {
    const result = text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    }).join('');
    return { output: result, success: true };
  } catch (error) {
    return { output: '', success: false, error: 'Caesar encryption failed' };
  }
}

export function caesarDecrypt(text: string, shift: number): EncryptionResult {
  return caesarEncrypt(text, 26 - shift);
}

// Vigenère Cipher
export function vigenereEncrypt(text: string, key: string): EncryptionResult {
  try {
    if (!key) return { output: '', success: false, error: 'Key is required' };
    
    const cleanKey = key.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanKey) return { output: '', success: false, error: 'Invalid key' };
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        const shift = cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 97;
        result += String.fromCharCode(((code - base + shift) % 26) + base);
        keyIndex++;
      } else {
        result += char;
      }
    }
    return { output: result, success: true };
  } catch (error) {
    return { output: '', success: false, error: 'Vigenère encryption failed' };
  }
}

export function vigenereDecrypt(text: string, key: string): EncryptionResult {
  try {
    if (!key) return { output: '', success: false, error: 'Key is required' };
    
    const cleanKey = key.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanKey) return { output: '', success: false, error: 'Invalid key' };
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        const shift = cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 97;
        result += String.fromCharCode(((code - base - shift + 26) % 26) + base);
        keyIndex++;
      } else {
        result += char;
      }
    }
    return { output: result, success: true };
  } catch (error) {
    return { output: '', success: false, error: 'Vigenère decryption failed' };
  }
}

// Reverse Cipher
export function reverseEncrypt(text: string): EncryptionResult {
  try {
    return { output: text.split('').reverse().join(''), success: true };
  } catch (error) {
    return { output: '', success: false, error: 'Reverse encryption failed' };
  }
}

export const reverseDecrypt = reverseEncrypt;

// XOR Cipher
export function xorEncrypt(text: string, key: string): EncryptionResult {
  try {
    if (!key) return { output: '', success: false, error: 'Key is required' };
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return { output: btoa(result), success: true };
  } catch (error) {
    return { output: '', success: false, error: 'XOR encryption failed' };
  }
}

export function xorDecrypt(text: string, key: string): EncryptionResult {
  try {
    if (!key) return { output: '', success: false, error: 'Key is required' };
    
    const decoded = atob(text);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return { output: result, success: true };
  } catch (error) {
    return { output: '', success: false, error: 'XOR decryption failed' };
  }
}

// Base64
export function base64Encrypt(text: string): EncryptionResult {
  try {
    return { output: btoa(text), success: true };
  } catch (error) {
    return { output: '', success: false, error: 'Base64 encoding failed' };
  }
}

export function base64Decrypt(text: string): EncryptionResult {
  try {
    return { output: atob(text), success: true };
  } catch (error) {
    return { output: '', success: false, error: 'Base64 decoding failed' };
  }
}

// AES Encryption
export function aesEncrypt(text: string, key: string): EncryptionResult {
  try {
    if (!key) return { output: '', success: false, error: 'Key is required' };
    const encrypted = CryptoJS.AES.encrypt(text, key).toString();
    return { output: encrypted, success: true };
  } catch (error) {
    return { output: '', success: false, error: 'AES encryption failed' };
  }
}

export function aesDecrypt(text: string, key: string): EncryptionResult {
  try {
    if (!key) return { output: '', success: false, error: 'Key is required' };
    const decrypted = CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
    if (!decrypted) return { output: '', success: false, error: 'Invalid key or corrupted data' };
    return { output: decrypted, success: true };
  } catch (error) {
    return { output: '', success: false, error: 'AES decryption failed' };
  }
}

// Simple RSA-like Encryption (Simplified for demonstration)
// Note: This is a simplified educational version, not for real security
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function modPow(base: number, exponent: number, modulus: number): number {
  if (modulus === 1) return 0;
  let result = 1;
  base = base % modulus;
  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }
  return result;
}

function generateRSAKeys() {
  // Using small primes for demonstration (not secure for real use)
  const p = 61;
  const q = 53;
  const n = p * q; // 3233
  const phi = (p - 1) * (q - 1); // 3120
  
  // Public exponent
  const e = 17;
  
  // Private exponent (simplified calculation)
  let d = 1;
  while ((d * e) % phi !== 1) {
    d++;
  }
  
  return { n, e, d };
}

export function rsaEncrypt(text: string): EncryptionResult {
  try {
    const { n, e } = generateRSAKeys();
    const encrypted = text.split('').map(char => {
      const charCode = char.charCodeAt(0);
      if (charCode > n) {
        return char.charCodeAt(0).toString().padStart(4, '0');
      }
      return modPow(charCode, e, n).toString().padStart(4, '0');
    }).join('-');
    
    return { 
      output: encrypted,
      success: true 
    };
  } catch (error) {
    return { output: '', success: false, error: 'RSA encryption failed' };
  }
}

export function rsaDecrypt(text: string): EncryptionResult {
  try {
    const { n, d } = generateRSAKeys();
    const parts = text.split('-');
    const decrypted = parts.map(part => {
      const num = parseInt(part);
      if (num > n) {
        return String.fromCharCode(num);
      }
      return String.fromCharCode(modPow(num, d, n));
    }).join('');
    
    return { 
      output: decrypted,
      success: true 
    };
  } catch (error) {
    return { output: '', success: false, error: 'RSA decryption failed' };
  }
}
