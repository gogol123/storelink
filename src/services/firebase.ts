
// Stub for Firebase Service
// This file would typically initialize Firebase and handle messaging
// Since we don't have keys, we'll outline the structure.

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useNotificationStore } from "../stores/notification";

// Placeholder config - replace with real env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let messaging: any = null;

export const initFirebase = async () => {
  try {
    // Only initialize if config is present (prevent crashing in dev without env)
    if (!firebaseConfig.apiKey) {
      console.warn("Firebase config missing. Skipping initialization.");
      return;
    }

    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      const notificationStore = useNotificationStore();

      const title = payload.notification?.title || 'Nouvelle Notification';
      const body = payload.notification?.body || '';
      const link = payload.data?.link || undefined;

      notificationStore.showNotification(title, body, link);
    });

    // Request permission and get token
    // In a real app, you'd check if we already have a token stored in electron-store
    // const storedToken = await window.electronAPI.store.get('fcmToken');

    // For now, we just log it if we get it
    try {
        const currentToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
        if (currentToken) {
            console.log('FCM Token:', currentToken);
            // await window.electronAPI.store.set('fcmToken', currentToken);
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
    }

  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
};
