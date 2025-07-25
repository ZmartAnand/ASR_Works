import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  // customerName='';
  ProductName = '';
  ProductPrice = '';
  ProductQuantity = '';
  isEditMode = false;
  productIdToEdit: string | null = null;
  existingCreatedAt: any = null;
  Customers: any[] = [];
  ProductDate: string = '';
  usercount: number = 1;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.listenToProducts((customers) => {
      this.Customers = customers;

      const tableSection = document.getElementById('tablesection');
      if (tableSection) {
        tableSection.hidden = this.Customers.length === 0;
      }
    });
  }

  save() {
    if (!this.ProductName || !this.ProductPrice || !this.ProductQuantity) {
      alert('Please fill all fields');
      return;
    }

    const CustomerData = {
      Product_Name: this.ProductName,
      Product_Price: this.ProductPrice,
      Product_Quantity: +this.ProductQuantity,
      Date: this.ProductDate || '',
      createdAt: this.existingCreatedAt || serverTimestamp(),
    };

    if (this.isEditMode && this.productIdToEdit) {
      this.authService
        .updateProduct(this.productIdToEdit, CustomerData)
        .then(() => {
          this.resetForm();
        });
    } else {
      this.authService.addProduct(CustomerData).then(() => {
        this.resetForm();
      });
    }
  }

  editProduct(product: any) {
    // this.customerName=product.customername;
    this.ProductName = product.Product_Name;
    this.ProductPrice = product.Product_Price;
    this.ProductQuantity = product.Product_Quantity;
    this.ProductDate = product.Date || '';
    this.productIdToEdit = product.id;
    this.existingCreatedAt = product.createdAt; // store original timestamp
    this.isEditMode = true;
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete?')) {
      this.authService.deleteProduct(id).then(() => {});
    }
  }

  resetForm() {
    // this.customerName='';
    this.ProductName = '';
    this.ProductPrice = '';
    this.ProductQuantity = '';
    this.ProductDate = '';
    this.isEditMode = false;
    this.productIdToEdit = null;
    this.existingCreatedAt = null;
  }

  exportToPDF(): void {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('ASR Product List', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['S.No', 'Product Name', 'Product Price', 'Product Quantity']],
      body: this.Customers.map((prod, i) => [
        i + 1,
        prod.name,
        prod.price,
        prod.quantity,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: { fontSize: 11 },
    });
    this.usercount++;
    doc.save('ASR_Products_' + 'customer_' + this.usercount + '.pdf');
  }

  searchTerm: string = '';

  filteredProducts(): any[] {
    if (!this.searchTerm.trim()) return this.Customers;

    // Prioritize matches at the top (case-insensitive "includes" search)
    const lowerTerm = this.searchTerm.toLowerCase();

    const matched = this.Customers.filter((p) =>
      p.name.toLowerCase().includes(lowerTerm)
    );

    const unmatched = this.Customers.filter(
      (p) => !p.name.toLowerCase().includes(lowerTerm)
    );

    return [...matched, ...unmatched]; // matched on top, rest below
  }

  highlightMatch(text: string, term: string): string {
    if (!term) return text;
    const re = new RegExp(`(${term})`, 'gi');
    return text.replace(re, `<mark>$1</mark>`);
  }

  getTotalPrice(): number {
    return this.filteredProducts().reduce((sum, p) => sum + Number(p.Product_Price), 0);
  }





  
}
