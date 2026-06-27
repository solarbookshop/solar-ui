import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/books';

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBook(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${isbn}`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(isbn: string, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${isbn}`, book);
  }

  deleteBook(isbn: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${isbn}`);
  }
}
