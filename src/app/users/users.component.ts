import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../shared/services/users.service';
import { IUser } from '../shared/interfaces';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

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

  dataSource = new MatTableDataSource(this.users);

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
      next: (users) => {
        this.users = users;
        this.dataSource.data = users;
      },
      error: (err) => console.error(err),
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
