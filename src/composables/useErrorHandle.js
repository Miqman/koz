import { toast } from 'vue3-toastify'
import { Notify } from 'quasar'

export function handleValidationErrors(errors, options = {}) {
  if (!errors || typeof errors !== 'object') return

  const {
    useQuasar = false,
    position = 'top-center',
    autoClose = 5000,
    separator = '<br>',
  } = options

  const errorMessages = []

  Object.keys(errors).forEach((field) => {
    if (Array.isArray(errors[field])) {
      errors[field].forEach((message) => {
        errorMessages.push(message)
      })
    }
  })

  if (errorMessages.length > 0) {
    const combinedMessage = errorMessages.join(separator)

    if (useQuasar) {
      Notify.create({
        type: 'negative',
        message: combinedMessage,
        position: position,
        html: true,
        timeout: autoClose,
      })
    } else {
      toast.error(combinedMessage, {
        position: position,
        dangerouslyHTMLString: true,
        autoClose: autoClose,
      })
    }
  }
}

export function getValidationErrorsAsArray(errors) {
  if (!errors || typeof errors !== 'object') return []

  const errorMessages = []
  Object.keys(errors).forEach((field) => {
    if (Array.isArray(errors[field])) {
      errors[field].forEach((message) => {
        errorMessages.push({ field, message })
      })
    }
  })

  return errorMessages
}
