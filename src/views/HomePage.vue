<script setup lang="ts">
import { onMounted } from 'vue';
import HelloWorld from '../components/HelloWorld.vue';
import { requestPermissionAndGetToken, onMessageListener } from '../services/firebase';
import { useNotificationStore } from '../stores/notification';

const { t } = useI18n();
const notificationStore = useNotificationStore();

onMounted(async () => {
  const token = await requestPermissionAndGetToken();
  if (token) {
    console.log('FCM Token:', token);
  }

  onMessageListener().then((payload: any) => {
    console.log('Received foreground message: ', payload);
    notificationStore.showNotification(
      payload.notification.title,
      payload.notification.body,
      payload.data?.url
    );
  });
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
      <p class="text-gray-500">
        Listening for FCM messages...
      </p>
    </div>
  </div>
</template>
