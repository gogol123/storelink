<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="text-center">
    <h2 class="text-2xl font-bold my-4">{{ t('homepage.title') }}</h2>
    <p class="text-gray-600 dark:text-gray-400">
      Bienvenue sur StoreLink. L'application tourne en arrière-plan.
    </p>
  </div>
</template>
