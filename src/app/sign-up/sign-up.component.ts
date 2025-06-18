import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  onSnapshot, } from 'firebase/firestore';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule,FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
    constructor(){}
  ProductName = "";
  ProductSize = "";
  ProductQuantity = "";
  save(){
    // if (!this.ProductName || !this.ProductSize || !this.ProductQuantity) {
    //   alert("Please fill all fields");
    //   return;
    // }
  
    // const productData = {
    //   name: this.ProductName,
    //   size: this.ProductSize,
    //   quantity: +this.ProductQuantity, // convert string to number
    //   createdAt: new Date()
    // };
  
    // const productCollection = collection(this.firestore, 'products');
  
    // addDoc(productCollection, productData)
    //   .then(() => {
    //     alert('Product saved successfully!');
    //     this.ProductName = "";
    //     this.ProductSize = "";
    //     this.ProductQuantity = "";
    //   })
    //   .catch((error) => {
    //     console.error("Error adding product:", error);
    //   });
  }
}