import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'solar-add-book',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-book.html',
  styleUrls: ['./add-book.css'],
})
export class AddBookComponent {
  private readonly fb = inject(FormBuilder);
  private readonly bookService = inject(BookService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly loading = signal<boolean>(false);

  protected readonly bookForm = this.fb.group({
    isbn: ['', [Validators.required, Validators.pattern(/^[0-9xX]{10,13}$/)]],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    author: ['', [Validators.required, Validators.maxLength(255)]],
    price: [9.99, [Validators.required, Validators.min(0.01)]],
    publisher: ['', [Validators.maxLength(255)]],
  });

  onSubmit(): void {
    if (this.bookForm.invalid) {
      return;
    }

    this.loading.set(true);
    const val = this.bookForm.value;

    const book = {
      id: undefined,
      isbn: val.isbn!,
      title: val.title!,
      author: val.author!,
      price: Number(val.price),
      publisher: val.publisher || undefined,
    };

    this.bookService.addBook(book).subscribe({
      next: (addedBook) => {
        this.snackBar.open(`"${addedBook.title}" successfully cataloged!`, 'OK', {
          duration: 3000,
        });
        this.router.navigate(['/get-books']);
      },
      error: (err) => {
        this.loading.set(false);
        let msg = 'Error adding book to catalog.';
        if (err.status === 422) {
          msg = 'A book with this ISBN already exists.';
          this.bookForm.get('isbn')?.setErrors({ isbnExists: true });
        } else {
          msg = err.error?.message || err.message || msg;
        }
        this.snackBar.open(msg, 'Dismiss', { duration: 5000 });
      },
    });
  }
}
