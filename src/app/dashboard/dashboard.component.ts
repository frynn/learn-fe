import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  profile: IUser | null = null;
  formGroup: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
  ) {
    this.formGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  login() {
    if (this.formGroup.invalid) {
      console.log('invalid >>');
      return;
    }
    this.authService.login(this.formGroup.value).subscribe(() => {
      this.authService.getProfile().subscribe((profile) => this.profile = profile);
    });
  }

  logout() {
    this.profile = null;
    this.authService.logout();
  }

}
