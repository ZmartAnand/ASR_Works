import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyD1z3OfBen-Otc6Cg_D5A1clT3o2HOGXU4',
  authDomain: 'asr-works7377-c1385.firebaseapp.com',
  projectId: 'asr-works7377-c1385',
  storageBucket: 'asr-works7377-c1385.firebasestorage.app',
  messagingSenderId: '869935470612',
  appId: '1:869935470612:web:044d4484072ccf790a2f01',
  measurementId: 'G-R5LH4YG9R6',
};

export const appConfig = [
  provideRouter(routes),
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  provideFirestore(() => getFirestore()),
  provideHttpClient(),
  provideAuth(() => getAuth()),
];
