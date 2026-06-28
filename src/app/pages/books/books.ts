import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Book } from '../../../types';
import { BookService } from '../../services/book.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'solar-books',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './books.html',
  styleUrls: ['./books.css'],
})
export class BooksComponent implements OnInit {
  protected readonly bookService = inject(BookService);
  protected readonly orderService = inject(OrderService);
  protected readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  // Component local state signals
  protected readonly books = signal<Book[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  // Ordering state
  protected readonly activeOrderBook = signal<string | null>(null);
  protected readonly orderQuantities = signal<Record<string, number>>({});
  protected readonly orderingIsbn = signal<string | null>(null);

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching books', err);
        this.error.set(err.message || 'Could not fetch catalog. Check your backend status.');
        this.loading.set(false);
      },
    });
  }

  confirmDelete(book: Book): void {
    if (confirm(`Are you sure you want to delete "${book.title}" from the catalog?`)) {
      this.bookService.deleteBook(book.isbn).subscribe({
        next: () => {
          this.snackBar.open(`Book "${book.title}" deleted.`, 'Dismiss', { duration: 3000 });
          this.loadBooks();
        },
        error: (err) => {
          this.snackBar.open(`Failed to delete book: ${err.error || err.message}`, 'Dismiss', { duration: 5000 });
        },
      });
    }
  }

  // Order logic
  openOrderForm(isbn: string): void {
    this.activeOrderBook.set(isbn);
    if (!this.orderQuantities()[isbn]) {
      this.orderQuantities.update((qtyMap) => ({ ...qtyMap, [isbn]: 1 }));
    }
  }

  closeOrderForm(): void {
    this.activeOrderBook.set(null);
  }

  getQuantity(isbn: string): number {
    return this.orderQuantities()[isbn] || 1;
  }

  setQuantity(isbn: string, qty: number): void {
    this.orderQuantities.update((qtyMap) => ({ ...qtyMap, [isbn]: qty }));
  }

  placeOrder(book: Book): void {
    const qty = this.getQuantity(book.isbn);
    this.orderingIsbn.set(book.isbn);

    this.orderService.submitOrder({ isbn: book.isbn, quantity: qty }).subscribe({
      next: () => {
        this.snackBar.open(`Order placed successfully for ${qty} copy/copies of "${book.title}".`, 'OK', {
          duration: 4000,
        });
        this.orderingIsbn.set(null);
        this.closeOrderForm();
      },
      error: (err) => {
        this.snackBar.open(`Failed to submit order: ${err.error?.message || err.message}`, 'Dismiss', {
          duration: 5000,
        });
        this.orderingIsbn.set(null);
      },
    });
  }
}
