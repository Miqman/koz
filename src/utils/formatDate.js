import { moment } from './mixing'
/**
 * Format date helper function
 * @param {string|number} date - Date input (unix timestamp, epoch or ISO string)
 * @param {string} type - Format type ('date', 'day', 'datetime', 'datetime-minutes', 'datetime-hours')
 * @returns {string} Formatted date string
 */
export function formatDate(date, type = 'date') {
  if (!date) return '-'

  // Cek apakah date adalah angka dengan 10 digit (timestamp dalam detik)
  const isUnixTimestamp = date < 1e12

  // Gunakan UTC agar tidak dikonversi ke zona lokal
  const momentDate = isUnixTimestamp ? moment.unix(date).utc() : moment.utc(date)

  if (!momentDate.isValid()) return '-'

  switch (type) {
    case 'date':
      return momentDate.format('DD/MM/YYYY')
    case 'day':
      return momentDate.format('dddd')
    case 'datetime':
      return momentDate.format('DD/MM/YYYY HH:mm:ss')
    case 'datetime-minutes':
      return momentDate.format('DD MMMM YYYY, HH:mm')
    case 'datetime-hours':
      return momentDate.format('DD/MM/YYYY HH')
    case 'hour-minutes':
      return momentDate.format('HH:mm')
    default:
      return momentDate.format('DD/MM/YYYY')
  }
}

export const formatDateForInput = (isoDate) => {
  if (!isoDate) return ''
  return new Date(isoDate).toISOString().split('T')[0]
}

export const formatDateFromInput = (dateString) => {
  if (!dateString) return null
  return new Date(dateString + 'T00:00:00.000Z').toISOString()
}
