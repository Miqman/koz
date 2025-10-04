import moment from 'moment'
import 'moment/dist/locale/id'

export { moment }

export function getBadge(status) {
  if (
    status === 'Selesai' ||
    status === 'Aktif' ||
    status === 'Publish' ||
    status === 'Sudah Disetor' ||
    status === 'Paid'
  ) {
    return 'badge-green w-fit'
  }
  if (
    status === 'Belum Selesai' ||
    status === 'Tidak Aktif' ||
    status === 'Draft' ||
    status === 'Belum Disetor' ||
    status === 'Cancelled'
  ) {
    return 'badge-red w-fit'
  }
  if (
    status === 'Selesai dengan perbedaan data' ||
    status === 'Maintenance' ||
    status === 'Archived' ||
    status === 'Refunded' ||
    status === 'Expired' ||
    status === 'Pending'
  ) {
    return 'badge-orange w-fit'
  }
}

export function getPaymentStatus(status) {
  switch (status) {
    case 1:
      return 'Pending'
    case 2:
      return 'Paid'
    case 3:
      return 'Cancelled'
    case 4:
      return 'Refunded'
    case 5:
      return 'Expired'
    default:
      return 'Unknown'
  }
}
export function getStatus(status) {
  switch (status) {
    case true:
    case 'active':
      return 'Aktif'
    case false:
    case 'inactive':
      return 'Tidak Aktif'
    default:
      return 'Unknown'
  }
}
export function wordingRole(role) {
  switch (role) {
    case 1:
      return 'Super Admin'
    case 2:
      return 'Admin'
    case 3:
      return 'User'
    default:
      return 'Unknown'
  }
}
