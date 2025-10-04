import { Quasar, LocalStorage, SessionStorage, Cookies, Notify, Loading, Dialog } from 'quasar'

// Import komponen yang akan digunakan
import {
  QBtn,
  QCard,
  QCardSection,
  QInput,
  QTable,
  QDialog,
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
  // tambahkan komponen lain sesuai kebutuhan
} from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

// A few examples for animations from Animate.css:
import '@quasar/extras/animate/fadeIn.css'
import '@quasar/extras/animate/fadeOut.css'

// // Import Quasar css
// import 'quasar/dist/quasar.css'

export default {
  install(app) {
    app.use(Quasar, {
      components: {
        QBtn,
        QCard,
        QCardSection,
        QInput,
        QTable,
        QDialog,
        QLayout,
        QHeader,
        QDrawer,
        QPageContainer,
        QPage,
      },
      plugins: {
        LocalStorage,
        SessionStorage,
        Cookies,
        Notify,
        Loading,
        Dialog,
      },
      config: {
        brand: {
          primary: '#487BE3',
          secondary: '#3F3F47',
          positive: '#00C951',
          // ... or all other brand colors
        },
      },
    })
  },
}
