<template>
  <main
    class="relative z-10 min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <!-- Animated Background -->
    <AnimatedBackground class="absolute inset-0 z-0" />

    <!-- Forgot Password Form -->
    <div class="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot Password?
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 max-w">
          Enter your email address to reset your password.
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form @submit.prevent="resetPassword" class="space-y-6">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
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
              <button
                type="submit"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset password
              </button>
            </div>

            <!-- Display error message -->
            <div v-if="errorMessage" class="text-red-500 text-center">
              {{ errorMessage }}
            </div>

            <!-- Display success message -->
            <div v-if="successMessage" class="text-green-500 text-center">
              {{ successMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from "vue";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Adjust the path as needed
import AnimatedBackground from "./AnimatedBackground.vue";

export default {
  name: "ForgotPassword",
  components: {
    AnimatedBackground,
  },
  setup() {
    const email = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");

    const resetPassword = async () => {
      try {
        // Check if the email is registered in Firebase Authentication
        await sendPasswordResetEmail(auth, email.value);
        successMessage.value =
          "A password reset link has been sent to your email.";
        errorMessage.value = ""; // Clear any previous error messages
      } catch (error) {
        console.error("Error resetting password:", error);
        if (error.code === "auth/user-not-found") {
          errorMessage.value = "No account found with this email address.";
        } else {
          errorMessage.value =
            "An error occurred while resetting your password. Please try again.";
        }
        successMessage.value = ""; // Clear any previous success messages
      }
    };

    return {
      email,
      errorMessage,
      successMessage,
      resetPassword,
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
