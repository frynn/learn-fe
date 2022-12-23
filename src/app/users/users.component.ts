import { Component, OnInit } from '@angular/core';
import { UsersService } from '../shared/services/users.service';
import { IUser } from '../shared/interfaces';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

  displayedColumns: string[] = [
    'UserId',
    'Username',
    'Email',
    'Phone',
    'Site',
    'Edit',
    'management',
  ];

  dataSource = new MatTableDataSource([] as IUser[]);
  length!: number;
  currentPageIndex: number = 0;
  currentPageSize: number = 5;

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
      next: () => this.getUsers(this.currentPageIndex, this.currentPageSize),
      error: (err) => console.error(err),
    });
  }

  getUsers(start?: number, limit?: number) {
    this.UsersService.getUsers(start, limit).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.length = response.total;
      },
      error: (err) => console.error(err),
    });
  }

  ngOnInit(): void {
    this.getUsers(this.currentPageIndex, this.currentPageSize);
  }

  onPage(event: PageEvent) {
    this.getUsers(event.pageIndex, event.pageSize);
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
  }
}
