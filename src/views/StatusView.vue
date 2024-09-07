<script setup>
import { useRouter } from 'vue-router'
import { useDarkModeStore } from '@/stores/darkMode.js'
import { gradientBgPurplePink } from '@/colors.js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useUserStore } from '@/stores/userStore.js'
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const styles = ['UXReviewer', 'Company'] // Updated statuses

const darkModeStore = useDarkModeStore()
darkModeStore.set(false)

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const error = ref('')
const user = ref(null)

// Update credits for "Company" users
const updateCredits = async (firebaseUid) => {
  try {
    await axios.put(`http://localhost:5000/api/users/${firebaseUid}/updateCredits`);
    console.log('Credits updated successfully');
  } catch (err) {
    console.error('Failed to update credits:', err.response?.data?.message || err.message);
  }
}

// Handle status change
const handleStatusChange = async (status) => {
  loading.value = true
  error.value = ''

  try {
    if (!user.value?.uid) {
      throw new Error('User not logged in or firebaseUid not available')
    }

    console.log('Updating status to:', status)

    await axios.put(`http://localhost:5000/api/users/${user.value.uid}/status`, { status })

    if (status === 'Company') {
      console.log('Status is Company, updating credits...')
      await updateCredits(user.value.uid)
    }

    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || err.message
    console.error('Failed to update status:', error.value)
  } finally {
    loading.value = false
  }
}

// Handle user login
const handleLogin = async () => {
  try {
    // await userStore.loginWithPopup();
    // user.value = userStore.user;
    router.push('/login')
  } catch (err) {
    console.error('Login error:', err.message);
    error.value = err.message;
  }
}

// Fetch user on component mount
onMounted(async () => {
  try {
    user.value = await userStore.fetchUser();
  } catch (err) {
    console.error('Error fetching user:', err.message);
  }
})

// Watch for changes in user and statusUpdatedOnce to handle redirection
watch(() => user.value, (newUser) => {
  if (newUser && newUser.statusUpdatedOnce === true) {
    router.push('/dashboard');
  }
})
</script>

<template>
  <LayoutGuest>
    <div :class="gradientBgPurplePink" class="flex min-h-screen items-center justify-center">
      <SectionMain>
        <div v-if="user && user.statusUpdatedOnce === false">
          <!-- User is logged in and status has not been updated -->
          <div v-if="loading" class="text-center text-white">Updating...</div>
          <div v-if="error" class="text-center text-red-500">{{ error }}</div>
          <h1 class="text-4xl md:text-5xl text-center text-white font-bold mt-12 mb-3 lg:mt-0">
            Pick a status&hellip;
          </h1>
          <h2 class="text-xl md:text-xl text-center text-white mb-12">
            Your status depicts your future
          </h2>
          <div class="grid gap-6 grid-cols-1 lg:grid-cols-2 px-6 max-w-6xl mx-auto">
            <CardBox
              v-for="status in styles"
              :key="status"
              class="cursor-pointer bg-gray-50"
              is-hoverable
              @click="handleStatusChange(status)"
            >
              <div class="mb-3 md:mb-6">
                <img
                  :src="`https://example.com/images/${status.toLowerCase()}-style.png`"
                  width="1280"
                  height="720"
                  alt="Status Image"
                />
              </div>

              <h1 class="text-xl md:text-2xl font-black capitalize">
                {{ status }}
              </h1>
              <h2 class="text-lg md:text-xl">Select your preferred status</h2>
            </CardBox>
          </div>
        </div>

        <div v-else-if="user === null || undefined">
          <!-- User is not logged in -->
          <h1 class="text-4xl md:text-5xl text-center text-white font-bold mt-12 mb-3 lg:mt-0">
            You are not logged in
          </h1>
          <h2 class="text-xl md:text-xl text-center text-white mb-12">
            Please log in to continue
          </h2>
          <div class="text-center">
            <button
              @click="handleLogin"
              class="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login
            </button>
            <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
          </div>
        </div>
        <div v-else>

        </div>
      </SectionMain>
    </div>
  </LayoutGuest>
</template>
