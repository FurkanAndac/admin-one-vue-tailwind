<script setup>
import { computed, ref, onMounted, defineEmits } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiEye, mdiTrashCan } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { useJobStore } from '@/stores/jobStore'
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'

// Define props
defineProps({
  checkable: Boolean,
})

// Use the store to fetch user/client details
const mainStore = useMainStore()
const userStore = useUserStore()
const jobStore = useJobStore()

const jobsArray = ref([])

// Computed property to access jobs from the store
const items = ref([])

const emit = defineEmits(['update-selected-jobs'])

const jobs = computed(() => jobStore.jobs)

const selectedJobs = ref(new Set())

// Manage modal state
const isModalActive = ref(false)
const isModalDangerActive = ref(false)

// Pagination settings
const perPage = ref(5)
const currentPage = ref(0)

// Checked rows management
const checkedRows = ref([])

// Paginated items
const itemsPaginated = computed(() =>
  items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

// Number of pages for pagination
const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

// Current page for display
const currentPageHuman = computed(() => currentPage.value + 1)

// Generate list of pages for pagination
const pagesList = computed(() => {
  const pages = []
  for (let i = 0; i < numPages.value; i++) {
    pages.push(i)
  }
  return pages
})

// Remove an item from an array
const remove = (arr, cb) => {
  const newArr = []
  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })
  return newArr
}

// Handle checked state of rows
const checked = (isChecked, job) => {
  if (isChecked) {
    // Add to checked rows if the checkbox is checked
    checkedRows.value.push(job)
  } else {
    // Remove from checked rows if unchecked
    checkedRows.value = remove(checkedRows.value, (row) => row.id === job.id)
  }
  emit('update-selected-jobs', Array.from(selectedJobs.value))
  // Call a function to update chart or other UI based on checkedRows
  updateChart()
}

const handleCheckboxChange = (event, jobId) => {
  if (event.target.checked) {
    console.log("checked jobId: " + jobId)
    selectedJobs.value.add(jobId)
  } else {
    selectedJobs.value.delete(jobId)
  }
  emit('update-selected-jobs', Array.from(selectedJobs.value))
}

// Stub method for chart update
const updateChart = () => {
  console.log('Checked rows:', checkedRows.value)
  // Logic to update the chart can be added here
}

const isChecked = (jobId) => selectedJobs.value.has(jobId)

// Automatically select the first job
const selectFirstJob = () => {
  if (items.value.length > 0) {
    const firstJobId = items.value[0]._id
    selectedJobs.value.add(firstJobId)
    emit('update-selected-jobs', Array.from(selectedJobs.value))
    console.log(`Automatically selected job: ${firstJobId}`)
  }
}

const downloadReport = async (reportId) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reports/download/${reportId}`, {
      responseType: 'blob', // Important to handle binary data
    });

    if (response.status === 200) {
      // Create a Blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a download link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `report_${reportId}.pdf`);

      // Append the link to the document body
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up by removing the link and revoking the object URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);

      console.log("Report downloaded successfully");
    } else {
      console.error("Failed to download report:", response.status);
    }
  } catch (error) {
    console.error("Error downloading report:", error);
  }
};

const backendUrl = import.meta.env.VITE_BACKEND_URL + '/api/reports/generate'
const generateReport = async (userId, jobId) => {
  try {
    const response = await axios.post(backendUrl, {
      userId: userId,
      jobId: jobId, // Pass the jobId in the request body
    });

    if (response.status === 200) {
      console.log("Report generated successfully:", response.data);
      // You can handle file download logic here if needed
    }
    if (response.status === 201) {
      console.log("Report generated successfully:", response.data);
      // You can handle file download logic here if needed
      // reportId.value = response.data.reportId
      downloadReport(response.data.reportId)

    } else {
      console.error("Failed to generate report:", response.status);
    }
  } catch (error) {
    console.error("Error generating report:", error);
  }
};

// Fetch jobs when the component is mounted
onMounted(async () => {
  const userId = userStore.user?._id
  console.log("User ID:", userId)
  await jobStore.fetchJobs(userId)
  console.log('Fetched Jobs:', jobStore.jobs)
  // Store the fetched jobs in the array
  items.value = jobStore.jobs
  // Automatically check the first job
  selectFirstJob()
})
</script>



<template>
  <CardBoxModal v-model="isModalActive" title="Sample modal">
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is a sample modal</p>
  </CardBoxModal>

  <CardBoxModal v-model="isModalDangerActive" title="Please confirm" button="danger" has-cancel>
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is a sample modal</p>
  </CardBoxModal>

  <!-- Job Table -->
  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th />

        <th>Website</th>
        <th>Credits</th>
        <th>Test Account</th>
        <th>Progress</th>
        <th />
      </tr>
    </thead>
    <tbody>
  <tr v-for="job in itemsPaginated" :key="job._id">
    <!-- Add a checkbox in front of every row -->
    <td>
      <input
        type="checkbox"
        :value="job._id"
        @change="handleCheckboxChange($event, job._id)"
        :checked="isChecked(job._id)"
      />
    </td>
    <!-- Rest of your table rows -->

    <td data-label="Website">{{ job.websiteUrl }}</td>
    <td data-label="Credits">{{ job.credits }}</td>
    <td data-label="Test Account">{{ job.testAccount }}</td>
    <td data-label="Progress" class="lg:w-32">
      <!-- Progress Bar -->
      <progress class="flex w-2/5 self-center lg:w-full" max="100" :value="job.completedBy.length">
        {{ job.completedBy.length }}
      </progress>
      <!-- Textual Progress (x/100) -->
      <div>{{ job.completedBy.length }}/100</div>
    </td>
    <td class="before:hidden lg:w-1 whitespace-nowrap">
      <BaseButtons type="justify-start lg:justify-end" no-wrap>
        <BaseButton color="info" :icon="mdiEye" small @click="isModalActive = true" />
        <BaseButton color="info" :icon="mdiEye" small @click="generateReport(userStore.user?._id, job._id)" />

        <BaseButton
          color="danger"
          :icon="mdiTrashCan"
          small
          @click="isModalDangerActive = true"
        />
      </BaseButtons>
    </td>
  </tr>
</tbody>


  </table>

  <!-- Pagination -->
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>

