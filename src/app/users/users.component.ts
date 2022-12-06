import { Component, OnInit } from '@angular/core';
import { UsersService } from '../shared/services/users.service';
import { IUser } from '../shared/interfaces';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
  
export class UsersComponent implements OnInit {
  constructor(private readonly UsersService: UsersService) {}
  users!: IUser[];

  displayedColumns: string[] = ['UserId', 'Username', 'Email', 'Phone', 'Site'];
  dataSource = this.users;
 
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



