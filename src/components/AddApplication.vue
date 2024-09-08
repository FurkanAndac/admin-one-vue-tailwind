<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Website UX Review Form</h2>

    <form @submit.prevent="submit">
      <!-- Website URL Input -->
      <FormField label="Website URL" required>
        <FormControl
          v-model="form.websiteUrl"
          type="url"
          placeholder="https://example.com"
          required
        />
      </FormField>

      <!-- Time Spent (Credits) Dropdown -->
      <DropdownSelect
        v-model="form.credits"
        :options="[
          { value: '1', text: '1 Credit - At least 5 minutes UX' },
          { value: '2', text: '2 Credits - At least 10 minutes UX' },
          { value: '3', text: '3 Credits - At least 15 minutes UX' }
        ]"
        label="Time Spent on UX (Credits)"
      />

      <!-- Other form fields... -->
      <!-- Test Account Info (Optional) -->
      <FormField label="Test Account Info (Optional)">
        <FormControl v-model="form.testAccount" type="textarea" placeholder="Provide username and password if needed. i.e. example@example.com, example"  />
      </FormField>

      <BaseDivider />

      <div class="flex justify-between">
        <BaseButton type="submit" color="primary" label="Submit" />
        <BaseButton type="reset" color="secondary" outline label="Reset" @click="resetForm" />
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useUserStore } from '@/stores/userStore'

const form = reactive({
  websiteUrl: '',
  credits: '1', // Default value for credits
  testAccount: '',
})

const submit = async () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL + '/api/jobs/add'
  // userStore = useUserStore()

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        websiteUrl: form.websiteUrl,
        credits: form.credits,
        testAccount: form.testAccount,
        email: useUserStore().user?.email,
        companyUid: useUserStore().user.firebaseUid
      }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Form submitted successfully:', result)
  } catch (error) {
    console.error('Form submission failed:', error)
  }
}

const resetForm = () => {
  form.websiteUrl = ''
  form.credits = '1'
  form.testAccount = ''
}
</script>

