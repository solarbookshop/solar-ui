import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Order, OrderStatus } from '../../../types';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'solar-orders',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
  ],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
})
export class OrdersComponent implements OnInit {
  protected readonly orderService = inject(OrderService);

  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly searchQuery = signal<string>('');

  // Table Columns
  protected readonly displayedColumns: string[] = [
    'id',
    'bookName',
    'isbn',
    'price',
    'quantity',
    'total',
    'status',
  ];

  // Derived state for stats widgets
  protected readonly totalOrdersCount = computed(() => this.orders().length);

  protected readonly acceptedOrdersCount = computed(
    () => this.orders().filter((o) => o.status === OrderStatus.ACCEPTED).length
  );

  protected readonly dispatchedOrdersCount = computed(
    () => this.orders().filter((o) => o.status === OrderStatus.DISPATCHED).length
  );

  protected readonly rejectedOrdersCount = computed(
    () => this.orders().filter((o) => o.status === OrderStatus.REJECTED).length
  );

  protected readonly totalRevenue = computed(() =>
    this.orders()
      .filter((o) => o.status !== OrderStatus.REJECTED)
      .reduce((sum, o) => sum + o.bookPrice * o.quantity, 0)
  );

  // Derived filtered orders
  protected readonly filteredOrders = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.orders();
    if (!query) {
      return list;
    }
    return list.filter(
      (o) =>
        o.bookName.toLowerCase().includes(query) ||
        o.bookIsbn.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.error.set(null);

    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching orders', err);
        this.error.set(err.message || 'Could not fetch orders. Check order-service connectivity.');
        this.loading.set(false);
      },
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}
