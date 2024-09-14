import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { auth } from '../../firebaseConfig'; // Adjust the import based on your file structure
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // Add other providers as needed
import axios from 'axios'; // Ensure axios is installed and imported

export const useUserStore = defineStore('user', () => {
  // State using ref
  const user = ref(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // or process.env.BACKEND_URL for older setups
  const error = ref('');

  // Fetch the user from Firebase Authentication and backend
  const fetchUser = async () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          // User is signed in, set the user state from Firebase Auth
          const firebaseUser = {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
          };

          // Now call the backend to get more user information
          try {
            const response = await axios.get(`${backendUrl}/api/users/${firebaseUser.uid}`);
            if (response.status === 200) {
              user.value = { ...firebaseUser, ...response.data }; // Merge Firebase and backend data
              console.log('Fetched user data from backend:', user.value);
              resolve(user.value); // Resolve the promise with the user data
            } else {
              console.error('Failed to fetch user from backend:', response.status);
              reject(new Error('Failed to fetch user from backend'));
            }
          } catch (error) {
            console.error('Detailed error:', error.response ? error.response.data : error.message);
            reject(error);
          }
        } else {
          // User is signed out
          user.value = null;
          console.log('No user is signed in.');
          resolve(null); // Resolve the promise with null
        }
      });
    });
  };

  // Handle user login with popup
  const loginWithPopup = async () => {
    const provider = new GoogleAuthProvider(); // Use the appropriate provider
    try {
      await signInWithPopup(auth, provider);
      // Fetch user after successful login
      await fetchUser();
    } catch (err) {
      error.value = err.message;
      console.error('Login failed:', err.message);
    }
  };

  // Getters using computed
  const userStatus = computed(() => {
    console.log('Computed user status:', user.value?.status); // Log the user status
    return user.value?.status;
  });

  return {
    user,
    fetchUser,
    loginWithPopup,
    userStatus,
    error,
  };
});
