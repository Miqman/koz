// utils/orderEncryption.js
// Dedicated encryption utilities for order data

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY
// Log encryption key status
console.log('🔑 Encryption Key Status:', {
  available: !!ENCRYPTION_KEY,
  length: ENCRYPTION_KEY?.length,
  preview: ENCRYPTION_KEY?.slice(0, 10) + '...',
  isDefault: ENCRYPTION_KEY === 'lokawisata_default_key_2025',
})

/**
 * Encrypt transaction number for secure URL navigation
 * @param {string} transactionNumber - Transaction number to encrypt
 * @returns {string|null} - Encrypted string or null if error
 */
export const encryptTransactionNumber = (transactionNumber) => {
  try {
    console.log('🔐 Encrypting transaction number:', transactionNumber)

    const data = {
      transactionNumber,
      timestamp: Date.now(),
    }

    const jsonString = JSON.stringify(data)
    console.log('🔐 Data to encrypt:', data)

    // Simple XOR encryption
    let encrypted = ''
    for (let i = 0; i < jsonString.length; i++) {
      const charCode = jsonString.charCodeAt(i)
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      encrypted += String.fromCharCode(charCode ^ keyChar)
    }

    // Encode to Base64 for URL safety
    const base64Encrypted = btoa(encrypted)
    const finalEncrypted = encodeURIComponent(base64Encrypted)

    console.log('✅ Encryption successful')
    console.log('🔐 Original length:', jsonString.length)
    console.log('🔐 Encrypted length:', finalEncrypted.length)
    console.log('🔐 Encrypted preview:', finalEncrypted.slice(0, 50) + '...')

    return finalEncrypted
  } catch (error) {
    console.error('❌ Encryption error:', error)
    return null
  }
}

/**
 * Decrypt transaction number from encrypted URL data
 * @param {string} encryptedData - Encrypted data string
 * @returns {string|null} - Decrypted transaction number or null if error
 */
export const decryptTransactionNumber = (encryptedData) => {
  try {
    console.log('🔓 Starting decryption...')
    console.log('🔓 Encrypted data preview:', encryptedData.slice(0, 50) + '...')

    // Decode URL encoding
    const decodedData = decodeURIComponent(encryptedData)
    console.log('🔓 URL decoded length:', decodedData.length)

    // Decode from Base64
    const encrypted = atob(decodedData)
    console.log('🔓 Base64 decoded length:', encrypted.length)

    // Simple XOR decryption
    let decrypted = ''
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i)
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      decrypted += String.fromCharCode(charCode ^ keyChar)
    }

    console.log('🔓 XOR decrypted:', decrypted)

    // Parse JSON
    const data = JSON.parse(decrypted)
    console.log('🔓 Parsed data:', data)

    // Validate data structure
    if (!data.transactionNumber) {
      throw new Error('Invalid data structure: missing transactionNumber')
    }

    // Check if data is not too old (optional)
    const currentTime = Date.now()
    const dataAge = currentTime - (data.timestamp || 0)
    const maxAge = 60 * 60 * 1000 // 1 hour

    console.log('🔓 Data age:', Math.round(dataAge / 1000), 'seconds')

    if (dataAge > maxAge) {
      console.warn('⚠️ Encrypted data is old, but proceeding anyway')
    }

    console.log('✅ Decryption successful:', data.transactionNumber)
    return data.transactionNumber
  } catch (error) {
    console.error('❌ Decryption error:', error)
    console.error('❌ Error details:', {
      message: error.message,
      encryptedDataLength: encryptedData?.length,
      encryptionKeyLength: ENCRYPTION_KEY?.length,
    })
    return null
  }
}

/**
 * Test encryption/decryption with a sample transaction number
 * @param {string} testTransactionNumber - Test transaction number
 */
export const testEncryption = (testTransactionNumber = 'TXN-TEST123') => {
  console.log('🧪 Testing encryption/decryption...')

  const encrypted = encryptTransactionNumber(testTransactionNumber)
  if (!encrypted) {
    console.error('❌ Encryption test failed')
    return false
  }

  const decrypted = decryptTransactionNumber(encrypted)
  if (!decrypted) {
    console.error('❌ Decryption test failed')
    return false
  }

  const success = decrypted === testTransactionNumber
  console.log(success ? '✅ Encryption test passed' : '❌ Encryption test failed')
  console.log('🧪 Original:', testTransactionNumber)
  console.log('🧪 Decrypted:', decrypted)

  return success
}

// Auto-test on import (only in development)
if (process.env.NODE_ENV === 'development') {
  testEncryption()
}
