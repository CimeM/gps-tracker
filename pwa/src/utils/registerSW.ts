import { registerSW } from 'virtual:pwa-register';

export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    // Wait for the 'load' event to not block other work
    window.addEventListener('load', () => {
      const updateSW = registerSW({
        onNeedRefresh() {
          // Show a notification to the user about the update
          if (confirm('New content is available. Click OK to update.')) {
            updateSW();
          }
        },
        onOfflineReady() {
          console.log('App ready to work offline');
        },
      });
    });
  }
};