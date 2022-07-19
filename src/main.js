import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

import firebaseConfig from '@/config/firebase.js'

const dbApp = initializeApp(firebaseConfig)

const db = getDatabase(dbApp)

/* eslint-disable */
function getDb() {
    return db;
}
/* eslint-enable */

createApp(App)
// .use(store)
  .use(router)
  .mount('#app')
