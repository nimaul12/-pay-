import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA offline support and fast launch
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('TakaPay PWA update available');
  },
  onOfflineReady() {
    console.log('TakaPay PWA ready for offline usage');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
