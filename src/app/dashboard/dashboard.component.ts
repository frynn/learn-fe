import { Component, OnInit } from '@angular/core';
import { IUser } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  profile: IUser | null = null;

  constructor(
    private readonly authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.authService.getProfile().subscribe({
      next: (profile) => (this.profile = profile),
      error: (err) => console.error(err),
    });
  }

  logout() {
    this.profile = null;
    this.authService.logout();
    this.router.navigateByUrl('login');
  }
}
