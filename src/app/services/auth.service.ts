import { Injectable } from '@angular/core';
import {
  doc,
  setDoc,
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firestore: Firestore) {}
  addProduct(user: any) {
    const CustomerCollection = collection(this.firestore, 'Customer Details');
    return addDoc(CustomerCollection, user);
  }

  updateProduct(id: string, user: any) {
    const CustomerDocRef = doc(this.firestore, 'Customer Details', id);
    return updateDoc(CustomerDocRef, user);
  }

  deleteProduct(id: string) {
    const CustomerDocRef = doc(this.firestore, 'Customer Details', id);
    return deleteDoc(CustomerDocRef);
  }
  listenToProducts(callback: (customer: any[]) => void) {
    const CustomerCollection = collection(this.firestore, 'Customer Details');
    const q = query(CustomerCollection, orderBy('createdAt', 'asc')); // 👈 Order by creation time ascending

    onSnapshot(q, (snapshot) => {
      const customer: any[] = [];
      snapshot.forEach((doc) => {
        customer.push({ id: doc.id, ...doc.data() });
      });
      callback(customer);
    });
  }
}