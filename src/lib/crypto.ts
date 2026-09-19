/**
 * Client-Side Zero-Knowledge Cryptography Engine for KutumbVault
 * Uses Web Crypto API (SubtleCrypto) with PBKDF2 & AES-256-GCM
 */

// Generate a random 16-byte salt
export function generateSalt(): Uint8Array {
  const salt = new Uint8Array(16);
  window.crypto.getRandomValues(salt);
  return salt;
}

// Convert ArrayBuffer to Hex string
export function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex string to Uint8Array
export function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Derive a 256-bit AES-GCM CryptoKey from a PIN/Password using PBKDF2
export async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt plaintext string using AES-256-GCM
export async function encryptData(data: string, password: string): Promise<{ ciphertext: string; salt: string; iv: string }> {
  const salt = generateSalt();
  const key = await deriveKeyFromPassword(password, salt);
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);

  const encoded = new TextEncoder().encode(data);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as any },
    key,
    encoded
  );

  return {
    ciphertext: bufferToHex(encrypted),
    salt: bufferToHex(salt.buffer as ArrayBuffer),
    iv: bufferToHex(iv.buffer as ArrayBuffer),
  };
}

// Decrypt ciphertext string using AES-256-GCM
export async function decryptData(encryptedObj: { ciphertext: string; salt: string; iv: string }, password: string): Promise<string> {
  const salt = hexToBuffer(encryptedObj.salt);
  const iv = hexToBuffer(encryptedObj.iv);
  const ciphertext = hexToBuffer(encryptedObj.ciphertext);

  const key = await deriveKeyFromPassword(password, salt);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as any },
    key,
    ciphertext as any
  );

  return new TextDecoder().decode(decrypted);
}

// Calculate SHA-256 Hash of a string (useful for tamper-evident verification)
export async function calculateSha256(input: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(input);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  return bufferToHex(hashBuffer);
}

// 12-word Mnemonic generation for Master Recovery Key
const BIP39_INDIAN_HERITAGE_WORDLIST = [
  'lotus', 'banyan', 'ganga', 'himalaya', 'shanti', 'prana',
  'kutumb', 'raksha', 'suraksha', 'kavach', 'deepam', 'anand',
  'dharma', 'satya', 'ahimsa', 'vedas', 'chakra', 'mandir',
  'sagar', 'amber', 'peacock', 'tulsi', 'sandal', 'saffron',
  'surya', 'chandra', 'nakshatra', 'ashoka', 'bharat', 'swaraj'
];

export function generateRecoveryMnemonic(): string[] {
  const words: string[] = [];
  const randomIndices = new Uint32Array(12);
  window.crypto.getRandomValues(randomIndices);
  for (let i = 0; i < 12; i++) {
    words.push(BIP39_INDIAN_HERITAGE_WORDLIST[randomIndices[i] % BIP39_INDIAN_HERITAGE_WORDLIST.length]);
  }
  return words;
}
