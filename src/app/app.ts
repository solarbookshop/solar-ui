import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service';
import { User } from '../types';
import { UserProfileDialog } from './components/user-profile-dialog/user-profile-dialog';

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
    MatMenuModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.checkAuthentication();
  }

  protected checkAuthentication(): void {
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

  protected openUserProfile(): void {
    this.dialog.open(UserProfileDialog, {
      width: '520px',
      maxWidth: '95vw',
      panelClass: 'user-profile-dialog-panel',
      data: this.authService.currentUser(),
    });
  }
}
