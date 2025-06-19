import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyA7Zh9Z8t_VZuUcFsUPxBjK63lGzNrtUu4',
  authDomain: 'asr-works-7377.firebaseapp.com',
  projectId: 'asr-works-7377',
  storageBucket: 'asr-works-7377.firebasestorage.app',
  messagingSenderId: '730131826833',
  appId: '1:730131826833:web:32aa765c028c3de5895730',
  measurementId: 'G-3M7CJ0DRJG',
};
export const appConfig = [
  provideRouter(routes),
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  provideFirestore(() => getFirestore()),
  provideHttpClient(),
  provideAuth(() => getAuth()),
];
