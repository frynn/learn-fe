import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/shared/interfaces';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent {
  formGroup?: FormGroup;

  id?: string;
  user?: IUser;

  constructor(
    private readonly fb: FormBuilder,
    private readonly usersService: UsersService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      usersService.getUser(this.id!).subscribe({
        next: (user) => {
          this.user = user;
          this.formGroup = this.fb.group({
            username: this.fb.control<string>(
              this.user.username,
              Validators.required,
            ),
            email: this.fb.control<string | undefined>(
              this.user.email,
              Validators.email,
            ),
            phone: this.fb.control<string | undefined>(
              this.user.phone,
              Validators.pattern('[- +()0-9]{6,12}'),
            ),
            site: this.fb.control<string | undefined>(
              this.user.site,
              Validators.pattern(
                '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?',
              ),
            ),
          });
        },
        error: (err) => console.error(err),
      });
    });
  }

  updateUser() {
    this.usersService.updateUser(this.id!, this.formGroup!.value).subscribe({
      next: () => this.router.navigateByUrl('users'),
      error: (err) => console.error(err),
    });
  }
}
