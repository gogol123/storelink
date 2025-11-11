<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HelloWorld from '../components/HelloWorld.vue';
import { requestPermissionAndGetToken } from '../services/firebase';

const { t } = useI18n();
const fcmToken = ref<string | null>(null);

onMounted(async () => {
  const token = await requestPermissionAndGetToken();
  fcmToken.value = token;
});
</script>

<template>
  <div class="text-center">
    <h1 class="text-2xl mb-3">
      {{ t('pageTitles.home') }}
    </h1>
    <HelloWorld
      msg="Electron + Vite + Vue + Pinia + Vue-Router + Tailwind CSS + Eslint + Prettier"
    />
    <div class="mt-4">
      <h2 class="text-lg font-bold">FCM Token:</h2>
      <p class="break-all">{{ fcmToken || 'No token available' }}</p>
    </div>
  </div>
</template>
