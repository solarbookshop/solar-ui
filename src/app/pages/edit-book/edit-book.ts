import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookService } from '../../services/book.service';
import { Book } from '../../../types';

@Component({
  selector: 'solar-edit-book',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './edit-book.html',
  styleUrls: ['./edit-book.css'],
})
export class EditBookComponent implements OnInit {
  // Bound from route: /edit-book/:isbn
  isbn = input.required<string>();

  private readonly fb = inject(FormBuilder);
  private readonly bookService = inject(BookService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly loading = signal<boolean>(false);
  protected readonly fetching = signal<boolean>(true);
  protected readonly error = signal<string | null>(null);

  protected readonly bookForm = this.fb.group({
    isbn: [{ value: '', disabled: true }],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    author: ['', [Validators.required, Validators.maxLength(255)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    publisher: ['', [Validators.maxLength(255)]],
  });

  ngOnInit(): void {
    this.fetchBookDetails();
  }

  private fetchBookDetails(): void {
    const targetIsbn = this.isbn();
    this.bookService.getBook(targetIsbn).subscribe({
      next: (book) => {
        this.bookForm.patchValue({
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          price: book.price,
          publisher: book.publisher || '',
        });
        this.fetching.set(false);
      },
      error: (err) => {
        console.error('Failed to load book', err);
        this.error.set(err.status === 404 ? 'Book not found' : 'Error retrieving book details');
        this.fetching.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      return;
    }

    this.loading.set(true);
    const val = this.bookForm.getRawValue();

    const book: Book = {
      id: undefined,
      isbn: val.isbn!,
      title: val.title!,
      author: val.author!,
      price: Number(val.price),
      publisher: val.publisher || undefined,
    };

    this.bookService.updateBook(this.isbn(), book).subscribe({
      next: () => {
        this.snackBar.open(`"${book.title}" updated successfully!`, 'OK', {
          duration: 3000,
        });
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || err.message || 'Error updating book.';
        this.snackBar.open(msg, 'Dismiss', { duration: 5000 });
      },
    });
  }
}
