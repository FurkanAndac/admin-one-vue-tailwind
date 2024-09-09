<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiMonitorCellphone,
  mdiReload,
  mdiChartPie
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import CardBox from '@/components/CardBox.vue'
import TableSampleClients from '@/components/TableSampleClients.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxTransaction from '@/components/CardBoxTransaction.vue'
import CardBoxClient from '@/components/CardBoxClient.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import SectionBannerStarOnGitHub from '@/components/SectionBannerStarOnGitHub.vue'
import { useUserStore } from '@/stores/userStore';
import { useJobStore } from '@/stores/jobStore'
import { useRouter } from 'vue-router'

const chartData = ref(null)
const userStore = useUserStore();
const jobStore = useJobStore();
const showIframe = ref(false); // Ref to control iframe visibility
const timer = ref(30); // 5 minutes in seconds
const timerRunning = ref(false); // Ref to control timer state
const nextButtonVisible = ref(false); // Ref to control next button visibility
const router = useRouter()

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData()
}

const startTimer = () => {
  if (!timerRunning.value) {
    timerRunning.value = true;
    const intervalId = setInterval(() => {
      if (timer.value > 0) {
        timer.value--;
      } else {
        timerRunning.value = false; // Stop the timer when it reaches zero
        nextButtonVisible.value = true; // Show the next button when timer hits 0
        clearInterval(intervalId); // Clear interval when timer ends
      }
    }, 1000); // Update every second
  }
}

onMounted(async () => {
  fillChartData();
  await userStore.fetchUser();
  if (userStore.user?.status === "UXReviewer") {
    await jobStore.fetchJobByAlgorithm(userStore.user);
  }
  console.log('User status after fetch:', userStore.userStatus); // Log the user status
  console.log('fetched job according to algorithm:', jobStore.selectedJob)
});

const isCompany = computed(() => userStore.userStatus === 'Company');
const isUser = computed(() => userStore.userStatus === 'Uxreviewer');
const status = computed(() => userStore.userStatus);

const mainStore = useMainStore()
mainStore.inExcercise = ref(false)

const clientBarItems = computed(() => mainStore.clients.slice(0, 4))
const transactionBarItems = computed(() => mainStore.history)

watch(() => userStore.userStatus, (newStatus) => {
  console.log('User status changed:', newStatus);
});

watch(isCompany, (newValue) => {
  console.log('isCompany changed:', newValue); // Log change in isCompany
});

watch(isUser, (newValue) => {
  console.log('isUser changed:', newValue); // Log change in isUser
});

const startReview = () => {
  mainStore.inExcercise = ref(true)
  showIframe.value = true; // Show the iframe when the button is clicked
  startTimer(); // Start the timer when the button is clicked
}

const handleNext = () => {
  // Handle the action for the "Next" button
  router.push('/forms')
  console.log('Next button clicked');
}
</script>


<template>
  <LayoutAuthenticated>
    <SectionMain>

      <template v-if="status === 'Company'">
        <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Overview" main />

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          <CardBoxWidget
            trend="12%"
            trend-type="up"
            color="text-emerald-500"
            :icon="mdiAccountMultiple"
            :number="512"
            label="Clients"
          />
          <CardBoxWidget
            trend="12%"
            trend-type="down"
            color="text-blue-500"
            :icon="mdiCartOutline"
            :number="7770"
            prefix="$"
            label="Sales"
          />
          <CardBoxWidget
            trend="Overflow"
            trend-type="alert"
            color="text-red-500"
            :icon="mdiChartTimelineVariant"
            :number="256"
            suffix="%"
            label="Performance"
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="flex flex-col justify-between">
            <CardBoxTransaction
              v-for="(transaction, index) in transactionBarItems"
              :key="index"
              :amount="transaction.amount"
              :date="transaction.date"
              :business="transaction.business"
              :type="transaction.type"
              :name="transaction.name"
              :account="transaction.account"
            />
          </div>
          <div class="flex flex-col justify-between">
            <CardBoxClient
              v-for="client in clientBarItems"
              :key="client.id"
              :name="client.name"
              :login="client.login"
              :date="client.created"
              :progress="client.progress"
            />
          </div>
        </div>

        <SectionBannerStarOnGitHub class="mt-6 mb-6" />

        <SectionTitleLineWithButton :icon="mdiChartPie" title="Trends overview">
          <BaseButton :icon="mdiReload" color="whiteDark" @click="fillChartData" />
        </SectionTitleLineWithButton>

        <CardBox class="mb-6">
          <div v-if="chartData">
            <LineChart :data="chartData" class="h-96" />
          </div>
        </CardBox>

        <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Clients" />

        <NotificationBar color="info" :icon="mdiMonitorCellphone">
          <b>Responsive table.</b> Collapses on mobile
        </NotificationBar>

        <CardBox has-table>
          <TableSampleClients />
        </CardBox>
      </template>

      <template v-else-if="status === 'UXReviewer'">
        <!-- User specific UI -->
        <h1 class="text-2xl font-bold">Hello UXReviewer!</h1>
        <p class="mt-2">
          Welcome to UXReviews.ai! The minimum amount of credits needed for payout is 50. Click the button below to get started!
        </p>

        <!-- Flexbox container to align card and button -->
        <div class="flex mt-6 space-x-6">
          <!-- Card with details -->
          <div class="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Job details</h2>
            <ul class="mt-2 text-gray-600 dark:text-gray-400">
              <li>URL to visit: {{ jobStore.selectedJob?.websiteUrl }} </li>
              <li>Credits: {{ jobStore.selectedJob?.credits }}</li>
              <li>Test credentials: {{ jobStore.selectedJob?.testAccount }}</li>
            </ul>
          </div>

          <!-- Start Review button with timer -->
          <div class="flex flex-col items-center">
            <button
              class='inline-flex justify-center items-center whitespace-nowrap focus:outline-none transition-colors focus:ring duration-150 border cursor-pointer rounded border-emerald-600 dark:border-emerald-500 ring-emerald-300 dark:ring-emerald-700 bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 hover:border-emerald-700 hover:dark:bg-emerald-600 hover:dark:border-emerald-600 py-2 px-3 mb-3'
              @click="startReview"
            >
              START REVIEW!
            </button>
            <!-- Timer -->
            <span v-if="timerRunning" class="timer-text text-lg font-medium">
              {{ Math.floor(timer / 60) }}:{{ (timer % 60).toString().padStart(2, '0') }}
            </span>
          </div>
        </div>

        <!-- Conditionally load iframe -->
        <div v-if="showIframe" class="mt-4">
          <iframe
            :src="jobStore.selectedJob?.websiteUrl"
            width="100%"
            height="600"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>

        <!-- Conditionally show next button -->
        <button v-if="nextButtonVisible" @click="handleNext" class="mt-4 inline-flex justify-center items-center whitespace-nowrap focus:outline-none transition-colors focus:ring duration-150 border cursor-pointer rounded border-blue-600 bg-blue-600 text-white hover:bg-blue-700 py-2 px-4">
          Next
        </button>
      </template>

    </SectionMain>
  </LayoutAuthenticated>
</template>


<style scoped>
/* Style for the countdown timer */
.timer-visual {
  position: absolute;
  top: 0;
  right: 0;
  margin: 1rem;
  background-color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timer-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}
</style>
