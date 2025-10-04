import { computed } from 'vue'
import { useAuthAdminStore } from '@/stores/auth-admin-store'

// Mapping permission (biar nggak hardcode angka di mana-mana)
const PERMISSIONS = {
  edit: 1,
  delete: 2,
  add: 3,
  read: 4,
}

export const useAccessControl = () => {
  const authStore = useAuthAdminStore()
  const user = computed(() => authStore.user)

  const hasAccess = (permission) => {
    if (!user.value) return false
    // If settings doesn't exist, user has full access
    if (!user.value.settings) return true
    return user.value.settings.includes(permission)
  }

  const can = (action) => {
    const permissionCode = PERMISSIONS[action]
    return hasAccess(permissionCode)
  }

  return {
    can, // contoh penggunaan: can('edit'), can('delete')
    hasAccess, // kalau butuh langsung cek pakai angka: hasAccess(1)
  }
}

export const appCodeOptions = () => {
  return [
    {
      label: 'Taman Safari Indonesia',
      value: '000001',
    },
    {
      label: 'Dufan Ancol',
      value: '000002',
    },
    {
      label: 'Trans Studio Bandung',
      value: '000003',
    },
    {
      label: 'Floating Market Lembang',
      value: '000004',
    },
  ]
}

export const roleId = computed(() => useAuthAdminStore().user?.role)
