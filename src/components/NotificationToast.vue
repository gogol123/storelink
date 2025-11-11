<script setup lang="ts">
/**
 * A large, intrusive toast notification component.
 * It is displayed as a modal overlay to grab the user's attention.
 */

// Props are used to control the visibility and content of the notification.
const props = defineProps<{
  visible: boolean;
  title: string;
  message: string;
  orderUrl?: string; // The URL to open when the user clicks "View Order".
}>();

// Emits are used to communicate user actions back to the parent component.
const emit = defineEmits(['close']);

function handleClose() {
  emit('close');
}

function handleViewOrder() {
  if (props.orderUrl && window.electronAPI) {
    window.electronAPI.openExternalLink(props.orderUrl);
    emit('close'); // Close the notification after opening the link.
  }
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="relative w-full max-w-md transform rounded-lg bg-white p-6 text-left shadow-xl transition-all dark:bg-slate-800">
        <div class="text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
            <!-- Bell Icon -->
            <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
          <div class="mt-3 text-center">
            <h3 id="modal-title" class="text-xl font-semibold leading-6 text-gray-900 dark:text-gray-100">
              {{ title }}
            </h3>
            <div class="mt-2">
              <p class="text-base text-gray-600 dark:text-gray-300">
                {{ message }}
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-6 space-y-3">
          <button
            v-if="orderUrl"
            @click="handleViewOrder"
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Voir la commande
          </button>
          <button
            @click="handleClose"
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-slate-700 dark:text-gray-100 dark:ring-slate-600 dark:hover:bg-slate-600"
          >
            {{ orderUrl ? 'Fermer' : 'Compris' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
