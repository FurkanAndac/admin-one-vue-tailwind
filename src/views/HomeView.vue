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
import BarChart from '@/components/Charts/BarChart.vue'
import Popup from '@/components/Popup.vue'; // Import your Popup component

const chartData = ref(null)
const userStore = useUserStore();
const jobStore = useJobStore();
const showIframe = ref(false); // Ref to control iframe visibility
const timer = ref(30); // 5 minutes in seconds
const timerRunning = ref(false); // Ref to control timer state
const nextButtonVisible = ref(false); // Ref to control next button visibility
const router = useRouter()
const selectedJobs = ref([])
const showPopup = ref(false);
const reviewButtonVisible = ref(false);

const updateSelectedJobs = (jobIds) => {
  selectedJobs.value = jobIds
  console.log("selectedJobs: ", selectedJobs.value)
  updateBarChartData()
}

const updateBarChartData = () => {
  // Filter jobs based on selected job IDs
  const filteredJobs = jobStore.jobs.filter(job => selectedJobs.value.includes(job._id))
  console.log("filteredJobs: ", filteredJobs)

  // Prepare chart data
  const chartData = {
    labels: generateFullMonthDates(), // X-axis labels (dates)
    datasets: [] // Datasets for each job
  }

  // Aggregate data
  const completionCounts = aggregateCompletionData(filteredJobs)

  // Populate chart data
  filteredJobs.forEach(job => {
    chartData.datasets.push({
      // label: "test", // Label for each job
      data: generateDataForJob(job, completionCounts), // Data for each job
      backgroundColor: generateRandomColor(), // Random color for each dataset
      borderColor: generateRandomColorBorder(), // Random border color for each dataset
      borderWidth: 1,
      websiteUrl: job.websiteUrl // Store the website URL for tooltip usage
    })
  })

  barChartData.value = chartData
}

// Utility function to aggregate job completion data by date
const aggregateCompletionData = (jobs) => {
  const completionCounts = {}

  // Initialize completionCounts with all dates set to 0
  generateFullMonthDates().forEach(date => {
    jobs.forEach(job => {
      if (!completionCounts[job._id]) {
        completionCounts[job._id] = {}
      }
      completionCounts[job._id][date] = 0
    })
  })

  // Iterate through each job and each completion
  jobs.forEach((job) => {
    job.completedBy.forEach((completion) => {
      const completedAt = new Date(completion.completedAt).toLocaleDateString() // Format the completion date
      if (completionCounts[job._id][completedAt] !== undefined) {
        completionCounts[job._id][completedAt] += 1
      }
    })
  })

  return completionCounts
}

const generateDataForJob = (job, completionCounts) => {
  return generateFullMonthDates().map(date => completionCounts[job._id][date] || 0)
}

const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
}

const generateRandomColorBorder = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 1)`; // Full opacity for border
}

const generateFullMonthDates = () => {
  const dates = [];
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get the total number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    // Create a date string in the format of 'MM/DD/YYYY'
    const date = new Date(year, month, day).toLocaleDateString();
    dates.push(date);
  }
  return dates;
};

const barChartData = ref(null)

const isBarChartVisible = computed(() => selectedJobs.value.length > 0)

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
  updateBarChartData()
  await userStore.fetchUser();
  console.log(userStore.user?.status)
  if (userStore.user?.status === "UXReviewer") {
    console.log("test1")
    await jobStore.fetchJobByAlgorithm(userStore.user);
    console.log('Initial errorMessage:', jobStore.errorMessage);
    // const payable = jobStore.checkPayableJob();
    // if (payable) {
    //   reviewButtonVisible.value = true
    // }
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

// Watch for changes in jobStore.errorMessage to trigger the popup
watch(() => jobStore.errorMessage, (newErrorMessage) => {
  if (newErrorMessage) {
    showPopup.value = true;
    console.log("showpopupvalue: "+ showPopup.value)
  } else {
    showPopup.value = false;
    console.log("showpopupvalue: "+ showPopup.value)
  }
});

const startReview = () => {
  mainStore.inExcercise = ref(true)
  showIframe.value = true; // Show the iframe when the button is clicked
  startTimer(); // Start the timer when the button is clicked
  window.open("https://temp-mail.org/en/")
  window.open(jobStore.selectedJob?.websiteUrl)

}

const handleNext = () => {
  // Handle the action for the "Next" button
  router.push('/forms')
  console.log('Next button clicked');
}

const componentKey = ref(0)

const reloadComponent = () => {
  componentKey.value++
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>

      <template v-if="status === 'Company'">
        <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Overview" main />

        <SectionTitleLineWithButton :icon="mdiChartPie" title="Trends overview">
          <BaseButton :icon="mdiReload" color="whiteDark" @click="reloadComponent" />
        </SectionTitleLineWithButton>

        <CardBox class="mb-6">
          <!-- <div v-if="chartData">
            <LineChart :data="chartData" class="h-96" />
          </div> -->
          <div :key="componentKey">
            <BarChart v-if="isBarChartVisible" :barChartData="barChartData" class="h-96" />
          </div>
        </CardBox>

        <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Clients" />

        <NotificationBar color="info" :icon="mdiMonitorCellphone">
          <b>Responsive table.</b> Collapses on mobile
        </NotificationBar>

        <CardBox has-table>
          <TableSampleClients @update-selected-jobs="updateSelectedJobs"/>
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
          <Popup :isVisible="showPopup" @close="showPopup = false">
            <h2 class="text-lg font-semibold">Popup Title</h2>
            <p class="mt-2">{{ jobStore.errorMessage + " Refresh the page for a new job!" }}</p>
            <button @click="showPopup = false" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Close
            </button>
          </Popup>

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
