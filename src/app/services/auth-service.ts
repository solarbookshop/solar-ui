import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../../types";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private httpXsrfTokenExtractor = inject(HttpXsrfTokenExtractor);
  readonly currentUser = signal<User | null>(null);

  readonly isEmployee = computed(() => {
    const user = this.currentUser();
    return !!user && (user.roles?.includes('employee') || false);
  });

  readonly isCustomer = computed(() => {
    const user = this.currentUser();
    return !!user && (user.roles?.includes('customer') || false);
  });

  getCsrfToken(): string {
    return this.httpXsrfTokenExtractor.getToken() || '';
  }

  authenticate(): Observable<User> {
    return this.httpClient.get<User>('/user');
  }

  login(): void {
    window.open('/oauth2/authorization/keycloak', '_self');
  }

  getUserInitials(user?: User | null): string {
    if (!user) {
      return '';
    }
    const first = user.firstName ? user.firstName.charAt(0) : '';
    const last = user.lastName ? user.lastName.charAt(0) : '';
    return (first + last).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U';
  }

  getDisplayRole(user?: User | null): string {
    if (!user || !user.roles || user.roles.length === 0) {
      return 'User';
    }
    if (user.roles.includes('employee')) {
      return 'Employee';
    }
    if (user.roles.includes('customer')) {
      return 'Customer';
    }
    const displayRole = user.roles.find(r => 
      !['offline_access', 'uma_authorization'].includes(r) && 
      !r.startsWith('default-roles')
    );
    if (displayRole) {
      return displayRole.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    }
    return 'User';
  }
}
