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
  import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule,FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
    constructor(private firestore:Firestore ,private authService : AuthService){}
  ProductName = "";
  ProductSize = "";
  ProductQuantity = "";
  productList: any[] = [];
  isEditMode = false;
  currentEditId: string | null=null;
  usercount = 1;
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
    if (this.isEditMode && this.currentEditId) {
      this.authService.updateProduct(this.currentEditId, productData)
        .then(() => {
          this.resetForm();
        })
        .catch(error => console.error("Update error:", error));
    } else {
      this.authService.addProduct(productData)
        .then(() => {
          this.resetForm();
        })
        .catch(error => console.error("Add error:", error));
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
  if (confirm("Are you sure you want to delete this product?")) {
    this.authService.deleteProduct(id)
      .then(() => {
      })
      .catch(error => {
        console.error("Error deleting product:", error);
      });
  }
}
exportToPDF(): void {
  if (this.productList.length === 0) {
    alert('No data to export.');
    return;
  }

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text('ASR Product List', 14, 15);

  // Prepare table columns and data
  const head = [['S.No', 'Product Name', 'Product Size', 'Product Quantity']];
  const data = this.productList.map(product => [
    product.index,
    product.name,
    product.size,
    product.quantity
  ]);

  // Create table
  autoTable(doc, {
    startY: 25,
    head: head,
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    styles: { fontSize: 11 }
  });
  this.usercount++;
  // Save PDF
  doc.save('ASR_Products_' + "customer_"+this.usercount + '.pdf');
}


}