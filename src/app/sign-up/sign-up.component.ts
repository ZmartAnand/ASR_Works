import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  ProductName = '';
  ProductPrice= '';
  ProductQuantity = '';
  isEditMode = false;
  productIdToEdit: string | null = null;
  existingCreatedAt: any = null;
  products: any[] = [];
  ProductDate: string = '';
  usercount: number = 1;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.listenToProducts((products) => {
      this.products = products;

      const tableSection = document.getElementById('tablesection');
      if (tableSection) {
        tableSection.hidden = this.products.length === 0;
      }
    });
  }

  save() {
    if (!this.ProductName || !this.ProductPrice || !this.ProductQuantity) {
      alert('Please fill all fields');
      return;
    }

    const productData = {
      name: this.ProductName,
      price: this.ProductPrice,
      quantity: +this.ProductQuantity,
      date: this.ProductDate || '',
      createdAt: this.existingCreatedAt || new Date(), // Preserve if editing
    };

    if (this.isEditMode && this.productIdToEdit) {
      this.authService
        .updateProduct(this.productIdToEdit, productData)
        .then(() => {
          this.resetForm();
        });
    } else {
      this.authService.addProduct(productData).then(() => {
        this.resetForm();
      });
    }
  }

  editProduct(product: any) {
    this.ProductName = product.name;
    this.ProductPrice = product.price;
    this.ProductQuantity = product.quantity;
    this.productIdToEdit = product.id;
      this.ProductDate = product.date || '';
    this.existingCreatedAt = product.createdAt; // store original timestamp
    this.isEditMode = true;
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete?')) {
      this.authService.deleteProduct(id).then(() => {});
    }
  }

  resetForm() {
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
      body: this.products.map((prod, i) => [
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
  if (!this.searchTerm.trim()) return this.products;

  // Prioritize matches at the top (case-insensitive "includes" search)
  const lowerTerm = this.searchTerm.toLowerCase();

  const matched = this.products.filter(p =>
    p.name.toLowerCase().includes(lowerTerm)
  );

  const unmatched = this.products.filter(p =>
    !p.name.toLowerCase().includes(lowerTerm)
  );

  return [...matched, ...unmatched]; // matched on top, rest below
}

highlightMatch(text: string, term: string): string {
  if (!term) return text;
  const re = new RegExp(`(${term})`, 'gi');
  return text.replace(re, `<mark>$1</mark>`);
}

}