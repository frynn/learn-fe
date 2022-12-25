import { Component, OnInit } from '@angular/core';
import { UsersService } from '../shared/services/users.service';
import { IUser } from '../shared/interfaces';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ImagesService } from '../shared/services/images.service';
import { map, mergeAll, mergeMap, of, toArray } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  constructor(
    private readonly UsersService: UsersService,
    private readonly imagesService: ImagesService,
    private dialog: MatDialog,
  ) {}

  displayedColumns: string[] = [
    'UserId',
    'Username',
    'imagePreview',
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
    this.UsersService.getUsers(start, limit)
      .pipe(
        map((response) => {
          this.length = response.total;
          return response.data;
        }),
        mergeAll(),
        mergeMap((user) => {
          if (user.avatar) {
            return this.imagesService
              .getImage(user.avatar)
              .pipe(map((imagePreview) => ({ ...user, imagePreview })));
          }
          return of(user);
        }),
        toArray(),
      )
      .subscribe({
        next: (users) => (this.dataSource.data = users),
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
