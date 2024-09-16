import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, MatTableModule, MatFormFieldModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  users: [] = [];
  displayedColumns: string[] = ['username', 'email', 'actions'];
  banPeriod: number = 0; // Period for banning a user
  selectedUser: any; // Store selected user for the ban action

  constructor(private adminService: AuthService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // Fetch users from the backend
  getUsers() {}

  // Delete a user and their reservations
  deleteUser(userId: string) {}

  // Reset a user's password
  resetPassword(userId: string) {}

  // Open the ban dialog
  openBanDialog(user: any) {}

  // Ban a user for the specified period
  banUser(userId: string) {}

  // Close the ban dialog
  closeBanDialog() {
    this.dialog.closeAll();
  }
}
