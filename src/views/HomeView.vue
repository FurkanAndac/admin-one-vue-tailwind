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
// import Status from '@/views/StatusView.vue'

const chartData = ref(null)
const userStore = useUserStore();

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData()
}

onMounted(async () => {
  fillChartData();
  await userStore.fetchUser();
  console.log('User status after fetch:', userStore.userStatus); // Log the user status
});

const isCompany = computed(() => userStore.userStatus === 'Company');
const isUser = computed(() => userStore.userStatus === 'Uxreviewer');
const status = computed(() => userStore.userStatus);


const mainStore = useMainStore()

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
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <template v-if="status==='Company'">
      <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Overview" main>
      </SectionTitleLineWithButton>

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
          <line-chart :data="chartData" class="h-96" />
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
    <template v-else-if="status==='UXReviewer'">
        <!-- User specific UI -->
        <h1>Hello User!</h1>
        <p>Welcome to your personalized dashboard.</p>
        <!-- Additional user-specific content -->
      </template>

    </SectionMain>
  </LayoutAuthenticated>
</template>
