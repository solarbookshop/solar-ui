import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'get-books',
    pathMatch: 'full'
  },
  {
    path: 'get-books',
    loadComponent: () => import('./pages/books/books').then(m => m.BooksComponent)
  },
  {
    path: 'add-book',
    loadComponent: () => import('./pages/add-book/add-book').then(m => m.AddBookComponent)
  },
  {
    path: 'edit-book/:isbn',
    loadComponent: () => import('./pages/edit-book/edit-book').then(m => m.EditBookComponent)
  },
  {
    path: 'get-orders',
    loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersComponent)
  },
  {
    path: '**',
    redirectTo: 'get-books'
  }
];
