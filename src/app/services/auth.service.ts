import { Injectable } from '@angular/core';
import { doc, setDoc , Firestore, collection, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestore : Firestore) {}

  addProduct(productData: any) {
    const productCollection = collection(this.firestore, 'products');
    return addDoc(productCollection, {
      ...productData,
      createdAt: new Date()
    });
  }

  updateProduct(id: string, productData: any) {
    const productDoc = doc(this.firestore, 'products', id);
    return updateDoc(productDoc, productData);
  }

  deleteProduct(id: string) {
    const productDoc = doc(this.firestore, 'products', id);
    return deleteDoc(productDoc);
  }
}
