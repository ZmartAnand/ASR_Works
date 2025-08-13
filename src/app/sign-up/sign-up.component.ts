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
    if (!this.ProductName || !this.ProductPrice) {
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
  formatDate(date: any): string {
    if (!date) return '-';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  }

private async getImageAsBase64(path: string): Promise<string> {
  const response = await fetch(path); // fetch image from assets
  const blob = await response.blob(); // convert to Blob
  return await this.readFileAsDataURL(blob); // convert to base64
}

private readFileAsDataURL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

  // exportToPDF(): void {
  //   const doc = new jsPDF('p', 'mm', 'a4');
  //   const pageWidth = doc.internal.pageSize.getWidth();

  //   // === HEADER ===
  //   doc.setFont('helvetica', 'bold');
  //   doc.setFontSize(20);
  //   doc.setTextColor(33, 37, 41); // Dark gray
  //   doc.text('ASR Product List', 14, 15);

  //   // Contact Info (Right Aligned)
  //   doc.setFontSize(11);
  //   doc.setFont('helvetica', 'normal');
  //   doc.setTextColor(80, 80, 80);
  //   doc.text('SivaKumar', pageWidth - 14, 15, { align: 'right' });
  //   doc.text('+91 9788753313', pageWidth - 14, 20, { align: 'right' });
  //   doc.text('+91 8144443313', pageWidth - 14, 25, { align: 'right' });

  //   // Divider line
  //   doc.setDrawColor(200, 200, 200);
  //   doc.setLineWidth(0.5);
  //   doc.line(14, 28, pageWidth - 14, 28);

  //   // === TABLE DATA ===
  //   const bodyData = this.Customers.map((prod, i) => [
  //     i + 1,
  //     this.formatDate(prod.Date),
  //     prod.Product_Name,
  //     prod.Product_Quantity,
  //     `Rs. ${prod.Product_Price}`
  //   ]);

  //   // Add total row
  //   const totalAmount = this.getTotalPrice();
  //   bodyData.push([
  //     { content: 'Total Amount', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
  //     { content: `Rs. ${totalAmount}`, styles: { halign: 'center', fontStyle: 'bold', textColor: [255, 255, 255], fillColor: [28, 49, 94] } }
  //   ]);

  //   // === TABLE STYLE ===
  //   autoTable(doc, {
  //     startY: 32,
  //     head: [['S.No', 'Date', 'Product Name', 'Quantity', 'Price']],
  //     body: bodyData,
  //     theme: 'grid',
  //     headStyles: { fillColor: [28, 49, 94], textColor: [255, 255, 255], fontSize: 12 },
  //     alternateRowStyles: { fillColor: [245, 245, 245] },
  //     styles: { fontSize: 10, cellPadding: 4, lineColor: [220, 220, 220], lineWidth: 0.1 },
  //   });

  //   // === FOOTER ===
  //   const today = new Date();
  //   doc.setFontSize(9);
  //   doc.setTextColor(120, 120, 120);
  //   doc.text(`Generated on: ${today.toLocaleString()}`, 14, doc.internal.pageSize.getHeight() - 10);
  //   doc.text(`Page 1 of 1`, pageWidth - 14, doc.internal.pageSize.getHeight() - 10, { align: 'right' });

  //   // Save file
  //   this.usercount++;
  //   doc.save(`ASR_Products_Customer_${this.usercount}.pdf`);
  // }

  async exportToPDF(){
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const navyBlue: [number, number, number] = [28, 49, 94];
    const lightGray: [number, number, number] = [240, 240, 240];

    // === PAGE BACKGROUND ===
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

   const logoBase64 = await this.getImageAsBase64('');
   console.log(logoBase64);
   

    // === HEADER BAR ===
    doc.setFillColor(navyBlue[0], navyBlue[1], navyBlue[2]);
    doc.rect(0, 0, pageWidth, 20, 'F');

     
     doc.addImage(logoBase64, 'JPEG', 5, 2, 15, 15); // x, y, width, height

    // Left Side Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('ASR Products List', 10, 8);
    doc.setFontSize(10);
    // doc.setFont('helvetica', 'normal');
    // doc.text('Professional Electrical & Plumbing Works', 10, 13);

    // Right Side Contact Info
    doc.setFontSize(12);
    doc.text('Sivakumar', pageWidth - 10, 8, { align: 'right' });
    doc.setFontSize(10);
    doc.text('+91 9788753313', pageWidth - 10, 12, { align: 'right' });
    doc.text('+91 8144443313', pageWidth - 10, 16, { align: 'right' });

    // === CUSTOMER NAME LABEL ===
    // doc.setFont('helvetica', 'bold');
    // doc.setFontSize(11);
    // doc.setTextColor(60, 60, 60);
    // doc.text(`Customer Name: ${this.customerName || 'Document'}`, 10, 28);

    // === TABLE DATA ===
    const bodyData = this.Customers.map((prod, i) => [
      i + 1,
      this.formatDate(prod.Date),
      prod.Product_Name,
      prod.Product_Quantity || '-',
      prod.Product_Price,
    ]);

    // Add total row
    const totalAmount = this.getTotalPrice();
    bodyData.push([
      {
        content: 'Total Amount',
        colSpan: 4,
        styles: { halign: 'center', fontStyle: 'bold' },
      },
      {
        content: `Rs. ${totalAmount}`,
        styles: {
          halign: 'center',
          fontStyle: 'bold',
          textColor: [255, 255, 255],
          fillColor: navyBlue,
        },
      },
    ]);

    autoTable(doc, {
      startY: 32,
      head: [['S.No', 'Date', 'Product Name', 'Quantity', 'Price']],
      body: bodyData,
      theme: 'grid',
      headStyles: {
        fillColor: navyBlue,
        textColor: [255, 255, 255],
        fontSize: 11,
        halign: 'center',
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: 'center',
        valign: 'middle',
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
    });

    // === FOOTER ===
    doc.setDrawColor(navyBlue[0], navyBlue[1], navyBlue[2]);
    doc.setLineWidth(0.5);
    doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text('Thank you for choosing ASR', pageWidth / 2, pageHeight - 15, {
      align: 'center',
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(
      'ASR Electrical & Plumbing  | +91 9788753313 | +91 8144443313 | sivarajee7377@gmail.com',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // === SAVE FILE ===
    this.usercount++;
    doc.save(`ASR_Report_${this.usercount}.pdf`);
  }

  searchTerm: string = '';

  filteredProducts(): any[] {
    if (!this.searchTerm.trim()) return this.Customers;

    // Prioritize matches at the top (case-insensitive "includes" search)
    const lowerTerm = this.searchTerm.toLowerCase();

    const matched = this.Customers.filter((p) =>
      p.Product_Name.toLowerCase().includes(lowerTerm)
    );

    const unmatched = this.Customers.filter(
      (p) => !p.Product_Name.toLowerCase().includes(lowerTerm)
    );

    return [...matched, ...unmatched]; // matched on top, rest below
  }

  highlightMatch(text: string, term: string): string {
    if (!term) return text;
    const re = new RegExp(`(${term})`, 'gi');
    return text.replace(re, `<mark>$1</mark>`);
  }

  getTotalPrice(): number {
    return this.filteredProducts().reduce(
      (sum, p) => sum + Number(p.Product_Price),
      0
    );
  }
}
