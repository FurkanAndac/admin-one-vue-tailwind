<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Login" help="Please enter your login">
          <FormControl
            v-model="form.login"
            :icon="mdiAccount"
            name="login"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="Remember"
          :input-value="true"
        />



        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Login" />
            <BaseButton to="/dashboard" color="info" outline label="Back" />
          </BaseButtons>
        </template>
      </CardBox>
      <button
          class="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          @click="handleLogin"
        >
          Login with Google
        </button>
    </SectionFullScreen>
  </LayoutGuest>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
// import axios from 'axios'
import { auth, googleProvider } from '../../firebaseConfig' // Adjust the import path as necessary
import { signInWithPopup, setPersistence, browserSessionPersistence } from 'firebase/auth'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import axios from 'axios';

const form = reactive({
  login: 'john.doe',
  pass: 'highly-secure-password-fYjUw-',
  remember: true
})

const router = useRouter()

// const handleRedirect = (uid) => {
//   const frontendUrl = `http://localhost:5173/admin-one-vue-tailwind/#/?uid=${uid}`;
//   window.open(frontendUrl, '_blank');
// };

// const handleSignIn = async (user) => {
//   const { uid, displayName, email, metadata } = user;
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   try {
//     const response = await axios.post(`${backendUrl}/api/users/add`, {
//       firebaseUid: uid,
//       name: displayName,
//       email,
//       metadata: {
//         creationTime: metadata?.creationTime,
//         lastSignInTime: metadata?.lastSignInTime,
//       }
//     });

//     if (response.status === 200) {
//       console.log('User already exists or was created:', response.data);
//     } else if (response.status === 201) {
//       console.log('User created successfully:', response.data);
//     }
//   } catch (error) {
//     console.error('Failed to send user data:', error);
//   }
// };


const handleLogin = async () => {

  try {
    // Set persistence to session
    await setPersistence(auth, browserSessionPersistence);

    // Sign in with Google popup
    const result = await signInWithPopup(auth, googleProvider);
    const userData = result.user;

    console.log('User logged in:', userData);

    // Call backend to add user
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/add`, {
        firebaseUid: userData.uid,
        name: userData.displayName,
        email: userData.email,
        metadata: {
          creationTime: userData.metadata.creationTime,
          lastSignInTime: userData.metadata.lastSignInTime,
        }
      });
      console.log('User added to backend:', response.data);
    } catch (backendError) {
      console.error('Failed to add user to backend:', backendError);
    }

    // Optionally handle sign-in (if needed) and redirect
    // await handleSignIn(userData);
    router.push('/');
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const submit = () => {
  router.push('/dashboard');
}
</script>
