import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth-service';
import { User } from '../../../types';

@Component({
  selector: 'solar-user-profile-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './user-profile-dialog.html',
  styleUrls: ['./user-profile-dialog.css'],
})
export class UserProfileDialog implements OnInit {
  protected readonly dialogRef = inject(MatDialogRef<UserProfileDialog>);
  protected readonly authService = inject(AuthService);
  protected readonly initialData: User | null = inject(MAT_DIALOG_DATA, { optional: true });

  protected readonly user = signal<User | null>(this.initialData);
  protected readonly loading = signal<boolean>(false);
  protected readonly rawJsonVisible = signal<boolean>(false);
  protected readonly lastFetchedTime = signal<Date | null>(null);

  ngOnInit(): void {
    this.refreshUserProfile();
  }

  protected refreshUserProfile(): void {
    this.loading.set(true);
    this.authService.authenticate().subscribe({
      next: (userData) => {
        this.user.set(userData);
        this.authService.currentUser.set(userData);
        this.lastFetchedTime.set(new Date());
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch from /user endpoint:', err);
        this.loading.set(false);
      },
    });
  }

  protected toggleRawJson(): void {
    this.rawJsonVisible.update((v) => !v);
  }

  protected getRoleBadgeClass(role: string): string {
    const lower = role.toLowerCase();
    if (lower.includes('employee')) return 'role-employee';
    if (lower.includes('customer')) return 'role-customer';
    return 'role-standard';
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
