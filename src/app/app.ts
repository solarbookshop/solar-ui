import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { AuthService } from './services/auth-service';
import { User } from '../types';

@Component({
  selector: 'solar-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected readonly authService = inject(AuthService);
  protected readonly currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    this.authService.authenticate().subscribe({
      next: (user) => {
        this.authService.currentUser.set(user);
      },
      error: (err) => {
        console.log('User is not authenticated:', err);
        this.authService.currentUser.set(null);
      },
    });
  }

  protected getUserInitials(user: User): string {
    const first = user.firstName ? user.firstName.charAt(0) : '';
    const last = user.lastName ? user.lastName.charAt(0) : '';
    return (first + last).toUpperCase() || user.username.charAt(0).toUpperCase() || 'U';
  }

  protected getDisplayRole(user: User): string {
    if (!user.roles || user.roles.length === 0) {
      return 'User';
    }
    const role = user.roles[0];
    return role.replace('ROLE_', '').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  }
}
