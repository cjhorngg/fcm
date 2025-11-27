// firebase-messaging-sw.js - GitHub Pages Compatible Version
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6jJgyEUdHF0lcu_fyfEoAbF9wnoNz-Rs",
  authDomain: "ntfy-server---client.firebaseapp.com",
  projectId: "ntfy-server---client",
  storageBucket: "ntfy-server---client.firebasestorage.app",
  messagingSenderId: "1048196653463",
  appId: "1:1048196653463:web:9d75414703d51962d2e4d2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Enhanced background message handler with GitHub Pages fallback
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Received background message on GitHub Pages:', payload);

  // Extract title and body
  let notificationTitle = 'New Notification';
  let notificationBody = 'You have a new message';
  
  if (payload.notification) {
    notificationTitle = payload.notification.title || notificationTitle;
    notificationBody = payload.notification.body || notificationBody;
  }
  
  if (payload.data) {
    if (payload.data.title) notificationTitle = payload.data.title;
    if (payload.data.message) notificationBody = payload.data.message;
  }

  // Show notification
  const notificationOptions = {
    body: notificationBody,
    icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
    data: payload.data,
    tag: 'fcm-message',
    requireInteraction: true
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event.notification);
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      for (let client of windowClients) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event.notification);
});