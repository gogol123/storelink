import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Interface representing the state of a notification.
 */
interface NotificationState {
  visible: boolean;
  title: string;
  message: string;
  orderUrl?: string;
}

/**
 * Pinia store for managing the notification state.
 */
export const useNotificationStore = defineStore('notification', () => {
  // --- State ---
  const notification = ref<NotificationState>({
    visible: false,
    title: '',
    message: '',
    orderUrl: undefined,
  });

  // --- Actions ---

  /**
   * Shows a notification with the given content.
   * @param title - The title of the notification.
   * @param message - The body message of the notification.
   * @param orderUrl - Optional URL for the "View Order" button.
   */
  function showNotification(title: string, message: string, orderUrl?: string) {
    notification.value = {
      visible: true,
      title,
      message,
      orderUrl,
    };

    // Bring the window to the front when a notification is shown.
    if (window.electronAPI) {
      window.electronAPI.bringWindowToFront();
    }

    // Play notification sound.
    // TODO: Add a sound file to the public/ directory and update the path.
    const audio = new Audio('/notification.wav');
    audio.play();
  }

  /**
   * Hides the notification.
   */
  function hideNotification() {
    notification.value.visible = false;
  }

  return {
    notification,
    showNotification,
    hideNotification,
  };
});
