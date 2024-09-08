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

const form = reactive({
  websiteUrl: '',
  credits: '1', // Default value for credits
  testAccount: '',
  initialImpression: '',
  easeOfAccess: '',
  findingInformation: '',
  visualAppeal: '',
  easeOfUse: '',
})

const submit = () => {
  console.log('Form data:', form)
}

const resetForm = () => {
  form.websiteUrl = ''
  form.credits = '1'
  form.testAccount = ''
  form.initialImpression = ''
  form.easeOfAccess = ''
  form.findingInformation = ''
  form.visualAppeal = ''
  form.easeOfUse = ''
}
</script>
