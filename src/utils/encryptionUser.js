// utils/encryption.js
import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY

if (!SECRET_KEY) {
  console.error('VITE_ENCRYPTION_KEY not found in environment variables')
}

/**
 * Encrypt a string value
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted text (Base64 URL-safe)
 */
export const encrypt = (text) => {
  try {
    if (!text || !SECRET_KEY) return text

    const encrypted = CryptoJS.AES.encrypt(text.toString(), SECRET_KEY).toString()
    // Make it URL-safe by replacing characters
    return btoa(encrypted).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  } catch (error) {
    console.error('Encryption error:', error)
    return text
  }
}

/**
 * Decrypt a string value
 * @param {string} encryptedText - Encrypted text to decrypt
 * @returns {string} - Decrypted text
 */
export const decrypt = (encryptedText) => {
  try {
    if (!encryptedText || !SECRET_KEY) return encryptedText

    // Restore the base64 padding and characters
    let base64 = encryptedText.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) {
      base64 += '='
    }

    const decrypted = atob(base64)
    const bytes = CryptoJS.AES.decrypt(decrypted, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption error:', error)
    return encryptedText
  }
}

/**
 * Create encrypted query parameters
 * @param {object} params - Object with key-value pairs
 * @returns {object} - Object with encrypted values
 */
export const encryptParams = (params) => {
  const encrypted = {}
  for (const [key, value] of Object.entries(params)) {
    encrypted[key] = encrypt(value)
  }
  return encrypted
}

/**
 * Decrypt query parameters
 * @param {object} params - Object with encrypted values
 * @returns {object} - Object with decrypted values
 */
export const decryptParams = (params) => {
  const decrypted = {}
  for (const [key, value] of Object.entries(params)) {
    decrypted[key] = decrypt(value)
  }
  return decrypted
}
