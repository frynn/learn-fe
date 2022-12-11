import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../shared/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.scss']
})
export class NewuserComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    username: this.fb.control<string>('', Validators.required),
    password: this.fb.control<string>('', Validators.required),
    email: this.fb.control<string>('', Validators.required),
    phone : this.fb.control<string | null>(''),
    site: this.fb.control<string | null>(''),
  });
  

  constructor(private readonly fb: FormBuilder, private readonly userService: UsersService, private readonly router: Router) {}

  ngOnInit(): void {
  }

  newUser() {
    this.userService.newUser(this.formGroup.value).subscribe({
      next: () => this.router.navigateByUrl('users'),
      error: (err) => console.error(err),
    })
  };
}
