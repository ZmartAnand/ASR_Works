import { CommonModule } from '@angular/common';
import { Component ,OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { doc, setDoc,Firestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot, } from '@angular/fire/firestore';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule,FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
    constructor(private firestore:Firestore){}
  ProductName = "";
  ProductSize = "";
  ProductQuantity = "";
  productList: any[] = [];
  isEditMode = false;
  currentEditId: string | null=null;
  resetForm() {
    this.ProductName = "";
    this.ProductSize = "";
    this.ProductQuantity = "";
    this.isEditMode = false;
    this.currentEditId = null;
  }
  ngOnInit(): void {
    const productCollection = collection(this.firestore, 'products');

    onSnapshot(productCollection, (snapshot) => {
      this.productList = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        index: index + 1,
        ...doc.data()
      }));

      // Show the table only when data exists
      const section = document.getElementById("tablesection");
      if (section) {
        section.hidden = this.productList.length === 0;
      }
    });
  }

  save(){
    if (!this.ProductName || !this.ProductSize || !this.ProductQuantity) {
      alert("Please fill all fields");
      return;
    }
  
    const productData = {
      name: this.ProductName,
      size: this.ProductSize,
      quantity: +this.ProductQuantity, // convert string to number
      createdAt: new Date()
    };
  
    const productCollection = collection(this.firestore, 'products');
  
   
  if (this.isEditMode && this.currentEditId) {
    const docRef = doc(this.firestore, 'products', this.currentEditId);
    updateDoc(docRef, productData)
      .then(() => {
        this.resetForm();
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  } else {
    addDoc(productCollection, {
      ...productData,
      createdAt: new Date()
    }).then(() => {
      this.resetForm();
    }).catch((error) => {
      console.error("Error adding product:", error);
    });
  }
}

editProduct(product: any) {
  this.ProductName = product.name;
  this.ProductSize = product.size;
  this.ProductQuantity = product.quantity;
  this.currentEditId = product.id;
  this.isEditMode = true;
}
deleteProduct(id: string) {
  const productDocRef = doc(this.firestore, 'products', id);
  deleteDoc(productDocRef)
    .then(() => {
    })
    .catch((error) => {
      console.error("Error deleting product:", error);
    });
}

}