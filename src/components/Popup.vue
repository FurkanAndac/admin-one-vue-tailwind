<template>
  <transition name="fade" @after-leave="afterLeave">
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="close"></div>
      <div class="relative bg-white p-6 rounded-lg shadow-lg z-10 max-w-sm mx-auto">
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" @click="close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: Boolean
});
const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
const afterLeave = () => {
  // Optional: Perform any action after the popup is removed from the DOM
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
