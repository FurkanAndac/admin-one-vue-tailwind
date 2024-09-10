<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  CategoryScale,
  Tooltip
} from 'chart.js'
import { useJobStore } from '@/stores/jobStore'

// Initialize Chart.js components
Chart.register(LineElement, PointElement, LineController, LinearScale, CategoryScale, Tooltip)

// Get the jobStore to access jobs data
const jobStore = useJobStore()

// Canvas reference
const root = ref(null)

// Initialize chart object
let chart

// Extract job completion data and organize it by date
const aggregateCompletionData = (jobs) => {
  const completionCounts = {}

  jobs.forEach((job) => {
    job.completedBy.forEach((completion) => {
      const completedAt = new Date(completion.completedAt).toLocaleDateString() // Extract and format the date
      if (!completionCounts[completedAt]) {
        completionCounts[completedAt] = 0
      }
      completionCounts[completedAt] += 1
    })
  })

  return completionCounts
}

// Watch for changes in jobStore.jobs and calculate data for chart
const chartData = computed(() => {
  const jobs = jobStore.jobs

  const completionCounts = aggregateCompletionData(jobs)

  // Prepare labels (x-axis) and data (y-axis)
  const labels = Object.keys(completionCounts) // Dates on x-axis
  const data = Object.values(completionCounts) // Count of completions on y-axis

  return {
    labels,
    datasets: [
      {
        label: 'Jobs Completed',
        data, // Y-axis values
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }
})

onMounted(() => {
  // Create the Chart.js chart on mount
  chart = new Chart(root.value, {
    type: 'line',
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          display: true,
          title: {
            display: true,
            text: 'Job Completions'
          }
        },
        x: {
          display: true,
          title: {
            display: true,
            text: 'Completion Date'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
})

// Update the chart when `chartData` changes
watch(chartData, (newData) => {
  if (chart) {
    chart.data = newData
    chart.update()
  }
})
</script>

<template>
  <canvas ref="root" />
</template>
