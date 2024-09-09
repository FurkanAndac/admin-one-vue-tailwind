<template>
  <main
    class="relative min-h-screen flex items-center justify-center bg-gray-100 py-12 sm:px-6 lg:px-8"
  >
    <!-- Animated Background -->
    <AnimatedBackground class="absolute inset-0 z-0" />

    <!-- Login form content -->
    <div class="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Log in with your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 max-w">
          Or
          <a
            @click.prevent="goToSignup"
            class="font-medium text-blue-600 hover:text-blue-500"
            role="button"
            tabindex="0"
            >sign up now</a
          >
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <GoogleSignInButton />

          <hr
            style="border: none; border-top: 1px solid #000; margin: 20px 0"
          />

          <form @submit.prevent="signIn" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email address</label
              >
              <div class="mt-1">
                <input
                  id="email"
                  v-model="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
                >Password</label
              >
              <div class="mt-1">
                <input
                  id="password"
                  v-model="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember_me"
                  v-model="rememberMe"
                  name="remember_me"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  for="remember_me"
                  class="ml-2 block text-sm text-gray-900"
                  >Remember me</label
                >
              </div>

              <div class="text-sm">
                <a
                  @click.prevent="goToForgotPassword"
                  class="font-medium text-blue-600 hover:text-blue-500"
                  role="button"
                  tabindex="0"
                  >Forgot password?</a
                >
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log in
              </button>
            </div>

            <!-- Display error message -->
            <div v-if="errorMessage" class="text-red-500 text-center">
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from "vue";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Adjust the path as needed
import { useRouter } from "vue-router";
import axios from "axios";
import AnimatedBackground from "./AnimatedBackground.vue";
import GoogleSignInButton from "./GoogleSignInButton.vue";

export default {
  name: "LogIn",
  components: {
    AnimatedBackground,
    GoogleSignInButton,
  },
  setup() {
    const email = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const errorMessage = ref("");
    const router = useRouter();

    const signIn = async () => {
      try {
        // Set the persistence type based on the "Remember me" checkbox
        await setPersistence(
          auth,
          rememberMe.value ? browserLocalPersistence : browserSessionPersistence
        );

        // Sign in the user with email and password
        const result = await signInWithEmailAndPassword(auth, email.value, password.value);
        const userData = result.user;

        console.log('User logged in:', userData);

        // Use the upsert to either add or update the user in the backend
        // await upsertUserToBackend(userData);

        // Redirect to homepage after login
        router.push("/");
      } catch (error) {
        console.error("Error signing in:", error);
        errorMessage.value =
          "Login failed. Please check your email and password and try again.";
      }
    };

    // Helper function to upsert user to the backend
    const upsertUserToBackend = async (userData) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/add`, {
          firebaseUid: userData.uid,
          name: userData.displayName || '', // Handle null or undefined displayName
          email: userData.email,
          metadata: {
            creationTime: userData.metadata.creationTime,
            lastSignInTime: userData.metadata.lastSignInTime,
          }
        });
        console.log('User upserted to backend:', response.data);
      } catch (backendError) {
        console.error('Failed to upsert user to backend:', backendError);
      }
    };

    const goToSignup = () => {
      router.push("/signup"); // Navigates to /signup
    };

    const goToForgotPassword = () => {
      router.push("/forgot-password"); // Navigates to /forgot-password
    };

    return {
      email,
      password,
      rememberMe,
      errorMessage,
      signIn,
      goToSignup,
      goToForgotPassword,
    };
  },
};
</script>


<style scoped>
.main {
  position: relative;
  min-height: 100vh;
}
</style>
