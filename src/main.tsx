import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {hydrateFromServer} from './utils/remote';
import {SYNCED_STORAGE_KEYS, applyEmbeddedConfig} from './utils/storage';

// Pull the latest saved state from the server (if any) before first render,
// because the app reads its initial state synchronously from localStorage.
// The offline build (single HTML file for a USB stick) has no server to talk to.
const isOffline = import.meta.env.MODE === 'offline';

if (isOffline) applyEmbeddedConfig();

(isOffline ? Promise.resolve() : hydrateFromServer(SYNCED_STORAGE_KEYS)).finally(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
