<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import menuAside from '@/menuAside.js'
import { useUserStore } from '@/stores/userStore'
import { generateMenuConfig } from '@/menuNavBar.js' // Import the function to generate menu config
import { useDarkModeStore } from '@/stores/darkMode.js'
import BaseIcon from '@/components/BaseIcon.vue'
import FormControl from '@/components/FormControl.vue'
import NavBar from '@/components/NavBar.vue'
import NavBarItemPlain from '@/components/NavBarItemPlain.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import FooterBar from '@/components/FooterBar.vue'
import { signOut } from 'firebase/auth' // Make sure to import this from Firebase
import { auth } from '../../firebaseConfig' // Adjust the import path according to your project structure

const layoutAsidePadding = 'xl:pl-60'

const darkModeStore = useDarkModeStore()
const userStore = useUserStore()

const router = useRouter()

const isAsideMobileExpanded = ref(false)
const isAsideLgActive = ref(false)

// Reactive menu configuration
const menuNavBar = ref([])

router.beforeEach(() => {
  isAsideMobileExpanded.value = false
  isAsideLgActive.value = false
})

const menuClick = async (event, item) => {
  if (item.isToggleLightDark) {
    darkModeStore.set()
  }

  if (item.isLogout) {
    // Handle logout
    try {
      await signOut(auth)
      userStore.user = null // Update user state
      console.log('User logged out')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
}

// Fetch user data and update menu configuration
const updateMenuConfig = async () => {
  await userStore.fetchUser() // Fetch user data
  const status = userStore.user?.status
  const credits = userStore.user?.credits || 0 // Default to 0 if credits are undefined

  menuNavBar.value = generateMenuConfig(status, credits)

  // Ensure DOM update after setting menuNavBar
  await nextTick()

  console.log("status:", status)
  console.log("credits:", credits)
}

onMounted(() => {
  updateMenuConfig()
})
</script>


<template>
  <div
    :class="{
      'overflow-hidden lg:overflow-visible': isAsideMobileExpanded
    }"
  >
    <div
      :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
      class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"
    >
      <NavBar
        :menu="menuNavBar"
        :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
        @menu-click="menuClick"
      >
        <NavBarItemPlain
          display="flex lg:hidden"
          @click.prevent="isAsideMobileExpanded = !isAsideMobileExpanded"
        >
          <BaseIcon :path="isAsideMobileExpanded ? mdiBackburger : mdiForwardburger" size="24" />
        </NavBarItemPlain>
        <NavBarItemPlain display="hidden lg:flex xl:hidden" @click.prevent="isAsideLgActive = true">
          <BaseIcon :path="mdiMenu" size="24" />
        </NavBarItemPlain>
        <NavBarItemPlain use-margin>
          <FormControl placeholder="Search (ctrl+k)" ctrl-k-focus transparent borderless />
        </NavBarItemPlain>
      </NavBar>
      <AsideMenu
        :is-aside-mobile-expanded="isAsideMobileExpanded"
        :is-aside-lg-active="isAsideLgActive"
        :menu="menuAside"
        @menu-click="menuClick"
        @aside-lg-close-click="isAsideLgActive = false"
      />
      <slot />
      <FooterBar>
        <!-- Get more with
        <a href="https://tailwind-vue.justboil.me/" target="_blank" class="text-blue-600"
          >Premium version</a
        > -->
      </FooterBar>
    </div>
  </div>
</template>
