import { Component, OnInit } from '@angular/core';
import { UsersService } from '../shared/services/users.service';
import { IUser } from '../shared/interfaces';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  constructor(
    private readonly UsersService: UsersService,
    private dialog: MatDialog,
  ) {}
  users: IUser[] = [];

  displayedColumns: string[] = [
    'UserId',
    'Username',
    'Email',
    'Phone',
    'Site',
    'Edit',
    'management',
  ];

  openDialog(user: IUser): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Delete user?',
        buttonName: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.deleteUser(user.userId);
        }
      },
      error: (err) => console.error(err),
    });
  }

  deleteUser(id: string) {
    this.UsersService.deleteUser(id).subscribe({
      next: () => this.getUsers(),
      error: (err) => console.error(err),
    });
  }

  getUsers() {
    this.UsersService.getUsers().subscribe({
      next: (users) => (this.users = users),
      error: (err) => console.error(err),
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }
}
