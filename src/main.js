import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMainStore } from '@/stores/main.js'
import { useUserStore } from '@/stores/userStore.js'
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import './css/main.css'

// Init Pinia
const pinia = createPinia()

// Create Vue app
createApp(App).use(router).use(pinia).mount('#app')

// Init main store
const mainStore = useMainStore(pinia)

// Fetch sample data
mainStore.fetchSampleClients()
mainStore.fetchSampleHistory()


// Ensure authentication persistence
// setPersistence(auth, browserLocalPersistence)
//   .then(() => {
//     const userStore = useUserStore();

//     onAuthStateChanged(auth, user => {
//       console.log("user:", user);
//       if (user) {
//         console.log('User is signed in:', user);
//         userStore.fetchUser(); // Fetch user data once the user is authenticated
//       } else {
//         console.log('No user is signed in.');
//         // Handle the case where no user is signed in
//       }
//     });
//   })
//   .catch((error) => {
//     console.error('Error setting persistence:', error);
//   });

// Dark mode
// Uncomment, if you'd like to restore persisted darkMode setting, or use `prefers-color-scheme: dark`. Make sure to uncomment localStorage block in src/stores/darkMode.js
// import { useDarkModeStore } from './stores/darkMode'

// const darkModeStore = useDarkModeStore(pinia)

// if (
//   (!localStorage['darkMode'] && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
//   localStorage['darkMode'] === '1'
// ) {
//   darkModeStore.set(true)
// }

// Default title tag
const defaultDocumentTitle = 'Admin One Vue 3 Tailwind'

// Set document title from route meta
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle
})
