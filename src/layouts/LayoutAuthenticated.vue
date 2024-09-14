<template>
  <div :class="{'overflow-hidden lg:overflow-visible': isAsideMobileExpanded}">
    <div :class="[layoutAsidePadding, {'ml-60 lg:ml-0': isAsideMobileExpanded}]"
         class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100">
      <NavBar :menu="menuNavBar"
              :class="[layoutAsidePadding, {'ml-60 lg:ml-0': isAsideMobileExpanded}]"
              @menu-click="menuClick">
        <NavBarItemPlain display="flex lg:hidden" @click.prevent="isAsideMobileExpanded = !isAsideMobileExpanded">
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
  v-if="!mainStore.inExcercise"
  :is-aside-mobile-expanded="isAsideMobileExpanded"
  :is-aside-lg-active="isAsideLgActive"
  :menu="menuAside"
  @menu-click="menuClick"
  @aside-lg-close-click="isAsideLgActive = false" />
      <slot />
      <FooterBar>
        <!-- Add your footer content here -->
      </FooterBar>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, defineProps, watch } from 'vue'
import { useRouter } from 'vue-router'
import { generateMenuAside } from '@/menuAside.js'
import { useUserStore } from '@/stores/userStore'
import { generateMenuConfig } from '@/menuNavBar.js'
import { useDarkModeStore } from '@/stores/darkMode.js'
import BaseIcon from '@/components/BaseIcon.vue'
import FormControl from '@/components/FormControl.vue'
import NavBar from '@/components/NavBar.vue'
import NavBarItemPlain from '@/components/NavBarItemPlain.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import FooterBar from '@/components/FooterBar.vue'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useMainStore } from '@/stores/main'
import { mdiForwardburger, mdiBackburger, mdiMenu } from '@mdi/js'

// Define props
const props = defineProps({
  asideMenuVisible: Boolean
})

const mainStore = useMainStore()
const layoutAsidePadding = 'xl:pl-60'

// Stores
const darkModeStore = useDarkModeStore()
const userStore = useUserStore()

const router = useRouter()

// State Variables
const isAsideMobileExpanded = ref(false)
const isAsideLgActive = ref(false)

// Reactive menu configuration
const menuAside = ref([])
const menuNavBar = ref([])

// Reset aside menu states before navigating to a new route
router.beforeEach(() => {
  isAsideMobileExpanded.value = false
  isAsideLgActive.value = false
})

// Menu click logic (toggle dark mode, logout, etc.)
const menuClick = async (event, item) => {
  if (item.isToggleLightDark) {
    darkModeStore.set()
  }

  if (item.isLogout) {
    try {
      await signOut(auth)
      userStore.user = null
      console.log('User logged out')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
}

// Watch the asideMenuVisible prop for changes
watch(() => props.asideMenuVisible, (newValue) => {
  console.log('AsideMenu visibility changed:', newValue)
})

// Reactive credits ref for user
const credits = ref(null)

// Fetch user data and update menu configurations dynamically
const updateMenuConfig = async () => {
  await userStore.fetchUser()
  const status = userStore.user?.status || 'default'
  credits.value = userStore.user?.credits || 0

  menuNavBar.value = await generateMenuConfig(status, credits)
  console.log("Generated Menu for NavBar:", JSON.stringify(menuNavBar.value))
  menuAside.value = await generateMenuAside(status)
  console.log("Generated Menu for Aside:", JSON.stringify(menuAside.value))
  await nextTick()
}

// When the component mounts, fetch user data and update menu config
onMounted(() => {
  updateMenuConfig()
})
</script>
