import { Injectable } from '@angular/core';
import { doc, setDoc , Firestore, collection, addDoc, updateDoc, deleteDoc,onSnapshot ,query,orderBy} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestore : Firestore) {}
  addProduct(product: any) {
    const productCollection = collection(this.firestore, 'products');
    return addDoc(productCollection, product);
  }

  updateProduct(id: string, product: any) {
    const productDocRef = doc(this.firestore, 'products', id);
    return updateDoc(productDocRef, product);
  }

  deleteProduct(id: string) {
    const productDocRef = doc(this.firestore, 'products', id);
    return deleteDoc(productDocRef);
  }

  listenToProducts(callback: (products: any[]) => void) {
    const productCollection = collection(this.firestore, 'products');
    const q = query(productCollection, orderBy('createdAt', 'asc')); // 👈 Order by creation time ascending
  
    onSnapshot(q, (snapshot) => {
      const products: any[] = [];
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      callback(products);
    });
  }
  
}