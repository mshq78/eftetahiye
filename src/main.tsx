import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {hydrateFromServer} from './utils/remote';
import {SYNCED_STORAGE_KEYS} from './utils/storage';

// Pull the latest saved state from the server (if any) before first render,
// because the app reads its initial state synchronously from localStorage.
hydrateFromServer(SYNCED_STORAGE_KEYS).finally(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
