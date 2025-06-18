import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyA5H83RJ-dr5DXGlCYJe8tmoLSRGE6ss3c',
  authDomain: 'asr-works-e6863.firebaseapp.com',
  projectId: 'asr-works-e6863',
  storageBucket: 'asr-works-e6863.firebasestorage.app',
  messagingSenderId: '568347989393',
  appId: '1:568347989393:web:300d3ea5131e2e7fad3630',
  measurementId: 'G-FLYP0DSZFC',
};

export const appConfig = [
  provideRouter(routes),
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  provideFirestore(() => getFirestore()),
  provideHttpClient(),
  provideAuth(() => getAuth()),
];
