import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full'
  },
  {
    path: 'books',
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
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersComponent)
  },
  {
    path: '**',
    redirectTo: 'books'
  }
];
