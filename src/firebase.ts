// ─────────────────────────────────────────────────────────────────────────────
// firebase.ts — Yuni Pakistan Firebase Configuration
//
// Credentials are read from Vite env vars (VITE_ prefix).
// Real project values are used as fallbacks so the app works without a .env.
//
// To update, edit the .env file in the project root.
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? 'AIzaSyDP46eGP2BBhZ9ihLMcZMofCxR_2ylqQhU',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? 'yuni-909e8.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? 'yuni-909e8',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? 'yuni-909e8.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '528565026435',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? '1:528565026435:web:8bc4b3ab384410eb1f65b6',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     ?? 'G-BKTF50TKSH',
};

// Prevent duplicate app initialisation during HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export default app;

