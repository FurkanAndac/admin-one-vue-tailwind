<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, BarElement, BarController, LinearScale, CategoryScale, Tooltip } from 'chart.js'

// Register Chart.js components
Chart.register(BarElement, BarController, LinearScale, CategoryScale, Tooltip)

// Props to receive the chart data
const props = defineProps({
  barChartData: {
    type: Object,
    required: true
  }
})

const root = ref(null)
let chart = null

onMounted(() => {
  if (root.value) {
    chart = new Chart(root.value, {
      type: 'bar',
      data: props.barChartData,
      options: {
        title: {display:true, text: " "},
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            display: true,
            title: {
              display: true,
              text: 'Completion Count'
            },
            ticks: {
            stepSize: 1,
          min: 0, // minimum value
          max: 100 // maximum value, you can either hard code if you know your datainput, else computer the value through some logic i.e taking the max value from the dataset and adding some extra value to it.
        }
          },
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date'
            },
          }
        },
        plugins: {
          legend: {
            display: true, // Ensure the legend is displayed
            position: 'top' // Position the legend above the chart
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                return tooltipItems[0].label
              },
              label: (tooltipItem) => {
                const dataset = props.barChartData.datasets[tooltipItem.datasetIndex]
                const value = tooltipItem.raw
                const url = dataset.websiteUrl // Access the website URL
                return `Value: ${value} - URL: ${url ? url : 'N/A'}`
              }
            }
          }
        }
      },
    })
  }
})


watch(() => props.barChartData, (newData) => {
  console.log(newData)
  if (chart) {
    chart.data = newData
    chart.update()
  }
})
</script>

<template>
  <canvas ref="root" />
</template>
