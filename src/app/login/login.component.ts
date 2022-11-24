import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private router:Router,
  ) { 
    this.formGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.formGroup.invalid) {
      console.log('invalid >>');
      return;
    }
    this.authService.login(this.formGroup.value)
    .subscribe(()=>this.router.navigateByUrl('/dashboard'));
  }

  ngOnInit(): void {
  }

}
