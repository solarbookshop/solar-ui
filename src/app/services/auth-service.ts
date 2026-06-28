import { inject, Injectable, signal } from '@angular/core';
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

  getCsrfToken(): string {
    return this.httpXsrfTokenExtractor.getToken() || '';
  }

  authenticate(): Observable<User> {
    return this.httpClient.get<User>('/user');
  }

  login(): void {
    window.open('/oauth2/authorization/keycloak', '_self');
  }
}
