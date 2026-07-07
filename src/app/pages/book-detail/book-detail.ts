import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';

import { BookService } from '../../services/book.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth-service';
import { Book } from '../../../types';

@Component({
  selector: 'solar-book-detail',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltip,
  ],
  templateUrl: './book-detail.html',
  styleUrls: ['./book-detail.css'],
})
export class BookDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);
  private readonly orderService = inject(OrderService);
  protected readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly book = signal<Book | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly quantity = signal<number>(1);
  protected readonly ordering = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const isbn = params.get('isbn');
      if (isbn) {
        this.loadBook(isbn);
      } else {
        this.error.set('No book ISBN specified.');
      }
    });
  }

  loadBook(isbn: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.bookService.getBook(isbn).subscribe({
      next: (data) => {
        this.book.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching book detail', err);
        this.error.set(err.message || 'Could not fetch book details. It may not exist.');
        this.loading.set(false);
      },
    });
  }

  placeOrder(): void {
    const bookData = this.book();
    if (!bookData) return;

    const qty = this.quantity();
    this.ordering.set(true);

    this.orderService.submitOrder({ isbn: bookData.isbn, quantity: qty }).subscribe({
      next: () => {
        this.snackBar.open(`Order placed successfully for ${qty} copy/copies of "${bookData.title}".`, 'OK', {
          duration: 4000,
        });
        this.ordering.set(false);
      },
      error: (err) => {
        this.snackBar.open(`Failed to submit order: ${err.error?.message || err.message}`, 'Dismiss', {
          duration: 5000,
        });
        this.ordering.set(false);
      },
    });
  }

  copyIsbn(): void {
    const bookData = this.book();
    if (!bookData) return;

    navigator.clipboard.writeText(bookData.isbn).then(() => {
      this.snackBar.open('ISBN copied to clipboard!', 'Dismiss', { duration: 2000 });
    });
  }
}

