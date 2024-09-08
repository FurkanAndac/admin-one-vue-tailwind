<template>
  <div class="relative inline-block w-full">
    <label class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <select
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="block w-full px-4 py-2 pr-8 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 12z" clip-rule="evenodd"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: 'Select Option'
  }
})
</script>
