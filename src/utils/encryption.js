// utils/encryption.js
// Encryption utilities for order data

// Get encryption key from environment variables
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY

// Warning if using default key
if (ENCRYPTION_KEY === 'lokawisata_default_key_2025') {
  console.warn(
    '⚠️ WARNING: Using default encryption key. Please set VUE_APP_ENCRYPTION_KEY in your .env file for production!',
  )
}

/**
 * Encrypt data using XOR cipher and Base64 encoding
 * @param {Object} data - Data to encrypt
 * @returns {string|null} - Encrypted string or null if error
 */
export const encryptData = (data) => {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data)

    // Simple XOR encryption
    let encrypted = ''
    for (let i = 0; i < jsonString.length; i++) {
      const charCode = jsonString.charCodeAt(i)
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      encrypted += String.fromCharCode(charCode ^ keyChar)
    }

    // Encode to Base64 for URL safety
    const base64Encrypted = btoa(encrypted)

    // Add timestamp for additional security
    const timestamp = Date.now()
    const finalData = `${base64Encrypted}.${timestamp}`

    return encodeURIComponent(finalData)
  } catch (error) {
    console.error('Encryption error:', error)
    return null
  }
}

/**
 * Decrypt data using XOR cipher and Base64 decoding
 * @param {string} encryptedData - Encrypted data string
 * @param {boolean} validateTimestamp - Whether to validate timestamp (default: false)
 * @returns {Object|null} - Decrypted data object or null if error
 */
export const decryptData = (encryptedData, validateTimestamp = false) => {
  try {
    // Decode URL encoding
    const decodedData = decodeURIComponent(encryptedData)

    // Split data and timestamp
    const [base64Encrypted, timestamp] = decodedData.split('.')

    // Check if timestamp is not too old (optional, untuk keamanan tambahan)
    if (validateTimestamp) {
      const currentTime = Date.now()
      const dataAge = currentTime - parseInt(timestamp)
      const maxAge = parseInt(process.env.VUE_APP_ENCRYPTION_TIMEOUT) || 30 * 60 * 1000 // Default 30 minutes

      if (dataAge > maxAge) {
        console.warn('Encrypted data is too old')
        return null
      }
    }

    // Decode from Base64
    const encrypted = atob(base64Encrypted)

    // Simple XOR decryption
    let decrypted = ''
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i)
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      decrypted += String.fromCharCode(charCode ^ keyChar)
    }

    // Parse JSON
    return JSON.parse(decrypted)
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}

/**
 * Validate order data structure
 * @param {Object} orderData - Order data to validate
 * @returns {boolean} - Whether data is valid
 */
export const validateOrderData = (orderData) => {
  if (!orderData || typeof orderData !== 'object') {
    return false
  }

  // Check required fields
  const requiredFields = ['tickets', 'totalAmount', 'visitDate']
  for (const field of requiredFields) {
    if (!(field in orderData)) {
      console.error(`Missing required field: ${field}`)
      return false
    }
  }

  // Validate tickets array
  if (!Array.isArray(orderData.tickets) || orderData.tickets.length === 0) {
    console.error('Invalid tickets data')
    return false
  }

  // Validate each ticket
  for (const ticket of orderData.tickets) {
    const requiredTicketFields = ['pricingId', 'quantity', 'price']
    for (const field of requiredTicketFields) {
      if (!(field in ticket)) {
        console.error(`Missing required ticket field: ${field}`)
        return false
      }
    }
  }

  return true
}

/**
 * Generate order hash for verification
 * @param {Object} orderData - Order data
 * @returns {string} - Order hash
 */
export const generateOrderHash = (orderData) => {
  const hashString = `${orderData.totalAmount}-${orderData.visitDate}-${orderData.tickets.length}-${ENCRYPTION_KEY.slice(0, 8)}`

  // Simple hash using XOR
  let hash = 0
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36).toUpperCase()
}

/**
 * Get encryption configuration
 * @returns {Object} - Configuration object
 */
export const getEncryptionConfig = () => {
  return {
    keyLength: ENCRYPTION_KEY.length,
    timeout: parseInt(process.env.VUE_APP_ENCRYPTION_TIMEOUT) || 30 * 60 * 1000,
    isDefaultKey: ENCRYPTION_KEY === 'lokawisata_default_key_2025',
    environment: process.env.NODE_ENV || 'development',
  }
}

// Example usage in payment page:
/*
import { decryptData, validateOrderData, generateOrderHash } from '@/utils/encryption'
import { useRoute } from 'vue-router'

const route = useRoute()

// Get encrypted data from URL
const encryptedData = route.query.data

if (encryptedData) {
  // Decrypt the order data (with timestamp validation in production)
  const isProduction = process.env.NODE_ENV === 'production'
  const orderData = decryptData(encryptedData, isProduction)

  if (orderData && validateOrderData(orderData)) {
    console.log('Order data:', orderData)

    // Generate hash for verification
    const orderHash = generateOrderHash(orderData)
    console.log('Order hash:', orderHash)

    // Use the order data...
  } else {
    console.error('Invalid order data')
    // Redirect back or show error
  }
} else {
  console.error('No order data found')
  // Redirect back or show error
}
*/
