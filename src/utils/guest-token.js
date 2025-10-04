// utils/guest-token.js
import CryptoJS from 'crypto-js'
import userApi from '@/utils/axios-user'

// Guest Access Configuration
const GUEST_ACCESS_CONFIG = {
  ACCESS_TOKEN_SECRET: import.meta.env.VITE_ACCESS_TOKEN_SECRET,
  GUEST_USER_ID: import.meta.env.VITE_USER_ID,
  ACCESS_TOKEN_EXPIRES_IN: import.meta.env.VITE_ACCESS_TOKEN_EXPIRES_IN || '7d',
}

// Token storage keys
const TOKEN_KEYS = {
  GUEST_TOKEN: 'guest_access_token',
  GUEST_TOKEN_CREATED: 'guest_token_created_at',
  GUEST_TOKEN_EXPIRES: 'guest_token_expires_at',
}

/**
 * Parse expiry string to seconds
 * @param {string} expiryString - Format: '7d', '24h', '60m', '3600s'
 * @returns {number} - Expiry in seconds
 */
const parseExpiryToSeconds = (expiryString) => {
  const timeUnit = expiryString.slice(-1)
  const timeValue = parseInt(expiryString.slice(0, -1))

  switch (timeUnit) {
    case 's':
      return timeValue
    case 'm':
      return timeValue * 60
    case 'h':
      return timeValue * 60 * 60
    case 'd':
      return timeValue * 60 * 60 * 24
    case 'w':
      return timeValue * 60 * 60 * 24 * 7
    default:
      return 60 * 60 * 24 * 7 // Default 7 days
  }
}

/**
 * Base64 URL Safe encoding
 * @param {string} str - String to encode
 * @returns {string} - Base64 URL Safe encoded string
 */
const base64UrlEncode = (str) => {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * Generate JWT Access Token for guest user
 * @param {string|number} userId - User ID (optional, uses env default)
 * @returns {string|null} - JWT token or null if failed
 */
const generateGuestToken = (userId = null) => {
  try {
    // Validate environment variables
    if (!GUEST_ACCESS_CONFIG.ACCESS_TOKEN_SECRET) {
      console.error('❌ VITE_ACCESS_TOKEN_SECRET not found in environment variables')
      throw new Error('ACCESS_TOKEN_SECRET tidak ditemukan')
    }

    if (!GUEST_ACCESS_CONFIG.GUEST_USER_ID && !userId) {
      console.error('❌ VITE_USER_ID not found in environment variables')
      throw new Error('GUEST_USER_ID tidak ditemukan')
    }

    const userIdToUse = userId || GUEST_ACCESS_CONFIG.GUEST_USER_ID

    console.log('🔧 Generating guest access token:', {
      userId: userIdToUse,
      expiresIn: GUEST_ACCESS_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
      hasSecret: !!GUEST_ACCESS_CONFIG.ACCESS_TOKEN_SECRET,
    })

    // JWT Header
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    }

    // JWT Payload
    const now = Math.floor(Date.now() / 1000)
    const expirySeconds = parseExpiryToSeconds(GUEST_ACCESS_CONFIG.ACCESS_TOKEN_EXPIRES_IN)

    const payload = {
      id: parseInt(userIdToUse),
      iat: now,
      exp: now + expirySeconds,
    }

    // Encode header and payload
    const encodedHeader = base64UrlEncode(JSON.stringify(header))
    const encodedPayload = base64UrlEncode(JSON.stringify(payload))

    // Create signature
    const signatureInput = `${encodedHeader}.${encodedPayload}`
    const signature = CryptoJS.HmacSHA256(signatureInput, GUEST_ACCESS_CONFIG.ACCESS_TOKEN_SECRET)

    // Convert signature to Base64 URL Safe
    const encodedSignature = CryptoJS.enc.Base64.stringify(signature)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    const token = `${encodedHeader}.${encodedPayload}.${encodedSignature}`

    console.log('✅ Guest token generated successfully')
    console.log('🔑 Token preview:', token.substring(0, 50) + '...')

    return token
  } catch (error) {
    console.error('❌ Error generating guest token:', error)
    return null
  }
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} - Decoded payload or null if invalid
 */
const verifyGuestToken = (token) => {
  try {
    if (!token) return null

    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.')

    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      throw new Error('Invalid token format')
    }

    // Decode payload
    const paddedPayload = encodedPayload + '='.repeat((4 - (encodedPayload.length % 4)) % 4)
    const decodedPayload = JSON.parse(atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/')))

    // Check expiry
    const now = Math.floor(Date.now() / 1000)
    if (decodedPayload.exp && decodedPayload.exp < now) {
      throw new Error('Token expired')
    }

    console.log('✅ Guest token verified successfully:', decodedPayload)
    return decodedPayload
  } catch (error) {
    console.error('❌ Guest token verification failed:', error)
    return null
  }
}

/**
 * Check if stored guest token is still valid
 * @returns {boolean} - True if valid, false otherwise
 */
const isGuestTokenValid = () => {
  try {
    const token = sessionStorage.getItem(TOKEN_KEYS.GUEST_TOKEN)
    if (!token) {
      console.log('📄 No guest token found in storage')
      return false
    }

    const payload = verifyGuestToken(token)
    const isValid = payload !== null

    console.log(`🔍 Guest token validation: ${isValid ? '✅ Valid' : '❌ Invalid'}`)
    return isValid
  } catch (error) {
    console.error('❌ Error checking guest token validity:', error)
    return false
  }
}

/**
 * Setup guest access with JWT token
 * @param {object} options - Configuration options
 * @param {boolean} options.force - Force regenerate token even if valid exists
 * @param {function} options.onError - Error callback function
 * @returns {boolean} - True if successful, false otherwise
 */
const setupGuestAccess = (options = {}) => {
  const { force = false, onError } = options

  try {
    console.log('🎭 Setting up guest access...')

    // Check if valid token already exists (unless forced)
    if (!force && isGuestTokenValid()) {
      const existingToken = sessionStorage.getItem(TOKEN_KEYS.GUEST_TOKEN)
      userApi.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`
      console.log('✅ Using existing valid guest token')
      return true
    }

    // Validate environment variables
    if (!GUEST_ACCESS_CONFIG.ACCESS_TOKEN_SECRET) {
      const error = new Error('Missing VITE_ACCESS_TOKEN_SECRET in environment variables')
      console.error('❌', error.message)
      if (onError) onError(error)
      return false
    }

    if (!GUEST_ACCESS_CONFIG.GUEST_USER_ID) {
      const error = new Error('Missing VITE_USER_ID in environment variables')
      console.error('❌', error.message)
      if (onError) onError(error)
      return false
    }

    // Generate new guest token
    const guestToken = generateGuestToken()

    if (guestToken) {
      const now = Date.now()
      const expirySeconds = parseExpiryToSeconds(GUEST_ACCESS_CONFIG.ACCESS_TOKEN_EXPIRES_IN)
      const expiresAt = now + expirySeconds * 1000

      // Set authorization header for API calls
      userApi.defaults.headers.common['Authorization'] = `Bearer ${guestToken}`

      // Store token and metadata
      sessionStorage.setItem(TOKEN_KEYS.GUEST_TOKEN, guestToken)
      sessionStorage.setItem(TOKEN_KEYS.GUEST_TOKEN_CREATED, now.toString())
      sessionStorage.setItem(TOKEN_KEYS.GUEST_TOKEN_EXPIRES, expiresAt.toString())

      console.log('✅ Guest access configured successfully')
      console.log('🎯 Using User ID:', GUEST_ACCESS_CONFIG.GUEST_USER_ID)
      console.log('⏰ Token expires in:', GUEST_ACCESS_CONFIG.ACCESS_TOKEN_EXPIRES_IN)
      console.log('📅 Expires at:', new Date(expiresAt).toLocaleString())

      return true
    } else {
      const error = new Error('Failed to generate guest token')
      console.error('❌', error.message)
      if (onError) onError(error)
      return false
    }
  } catch (error) {
    console.error('❌ Error setting up guest access:', error)
    if (onError) onError(error)
    return false
  }
}

/**
 * Clear guest access data
 * @returns {void}
 */
const clearGuestAccess = () => {
  try {
    console.log('🧹 Clearing guest access data...')

    // Remove authorization header
    delete userApi.defaults.headers.common['Authorization']

    // Clear stored data
    Object.values(TOKEN_KEYS).forEach((key) => {
      sessionStorage.removeItem(key)
    })

    console.log('✅ Guest access data cleared')
  } catch (error) {
    console.error('❌ Error clearing guest access:', error)
  }
}

/**
 * Get guest token info
 * @returns {object|null} - Token information or null
 */
const getGuestTokenInfo = () => {
  try {
    const token = sessionStorage.getItem(TOKEN_KEYS.GUEST_TOKEN)
    const createdAt = sessionStorage.getItem(TOKEN_KEYS.GUEST_TOKEN_CREATED)
    const expiresAt = sessionStorage.getItem(TOKEN_KEYS.GUEST_TOKEN_EXPIRES)

    if (!token) return null

    const payload = verifyGuestToken(token)
    if (!payload) return null

    return {
      token: token.substring(0, 50) + '...', // Preview only
      userId: payload.id,
      createdAt: createdAt ? new Date(parseInt(createdAt)) : null,
      expiresAt: expiresAt ? new Date(parseInt(expiresAt)) : null,
      issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
      expiresAtFromToken: payload.exp ? new Date(payload.exp * 1000) : null,
      isValid: true,
    }
  } catch (error) {
    console.error('❌ Error getting guest token info:', error)
    return null
  }
}

/**
 * Refresh guest token if near expiry
 * @param {number} thresholdMinutes - Refresh if expires within this many minutes (default: 60)
 * @returns {boolean} - True if refreshed or still valid, false if failed
 */
const refreshGuestTokenIfNeeded = (thresholdMinutes = 60) => {
  try {
    const tokenInfo = getGuestTokenInfo()
    if (!tokenInfo) {
      console.log('🔄 No valid token found, setting up new guest access')
      return setupGuestAccess()
    }

    const now = Date.now()
    const expiresAt = tokenInfo.expiresAt?.getTime() || tokenInfo.expiresAtFromToken?.getTime()

    if (!expiresAt) {
      console.log('🔄 Cannot determine token expiry, refreshing')
      return setupGuestAccess({ force: true })
    }

    const timeUntilExpiry = expiresAt - now
    const thresholdMs = thresholdMinutes * 60 * 1000

    if (timeUntilExpiry <= thresholdMs) {
      console.log(`🔄 Token expires in ${Math.round(timeUntilExpiry / 60000)} minutes, refreshing`)
      return setupGuestAccess({ force: true })
    }

    console.log(`✅ Token still valid for ${Math.round(timeUntilExpiry / 60000)} minutes`)
    return true
  } catch (error) {
    console.error('❌ Error refreshing guest token:', error)
    return false
  }
}

/**
 * Main function to ensure guest access is available
 * @param {object} options - Configuration options
 * @returns {Promise<boolean>} - True if guest access is ready, false otherwise
 */
const ensureGuestAccess = async (options = {}) => {
  try {
    console.log('🚀 Ensuring guest access is available...')

    // First, try to refresh if needed
    const refreshResult = refreshGuestTokenIfNeeded()

    if (refreshResult) {
      console.log('✅ Guest access is ready')
      return true
    }

    // If refresh failed, try to setup new access
    console.log('🔧 Setting up new guest access...')
    const setupResult = setupGuestAccess(options)

    if (setupResult) {
      console.log('✅ Guest access setup completed')
      return true
    }

    console.error('❌ Failed to ensure guest access')
    return false
  } catch (error) {
    console.error('❌ Error ensuring guest access:', error)
    if (options.onError) options.onError(error)
    return false
  }
}

// Export all functions
export {
  generateGuestToken,
  verifyGuestToken,
  isGuestTokenValid,
  setupGuestAccess,
  clearGuestAccess,
  getGuestTokenInfo,
  refreshGuestTokenIfNeeded,
  ensureGuestAccess,
  GUEST_ACCESS_CONFIG,
  TOKEN_KEYS,
}

// Default export for convenience
export default {
  generateGuestToken,
  verifyGuestToken,
  isGuestTokenValid,
  setupGuestAccess,
  clearGuestAccess,
  getGuestTokenInfo,
  refreshGuestTokenIfNeeded,
  ensureGuestAccess,
  GUEST_ACCESS_CONFIG,
  TOKEN_KEYS,
}
