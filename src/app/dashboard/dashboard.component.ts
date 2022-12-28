import { Component, OnInit } from '@angular/core';
import { IUser } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  profile: IUser | null = null;
  message: string = '';
  hours = new Date().getHours();

  messageInput() {
    if (this.hours >= 5 && this.hours < 12) {
      this.message = 'Доброе утро';
    } else if (this.hours >= 12 && this.hours < 18) {
      this.message = 'Добрый день';
    } else if (this.hours >= 18 && this.hours < 24) {
      this.message = 'Добрый вечер';
    } else if (this.hours >= 24 && this.hours < 5) {
      this.message = 'Доброй ночи';
    }
  }

  getProfile() {
    this.authService.getProfile().subscribe({
      next: (profile) => (this.profile = profile),
      error: (err) => console.error(err),
    });
  }

  ngOnInit(): void {
    this.messageInput();
    this.getProfile();
  }
}
