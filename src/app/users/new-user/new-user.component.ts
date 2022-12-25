import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { Router } from '@angular/router';
import { ImagesService } from 'src/app/shared/services/images.service';

@Component({
  selector: 'app-newuser',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    username: this.fb.control<string>('', Validators.required),
    password: this.fb.control<string>('', Validators.required),
    email: this.fb.control<string>('', Validators.email),
    phone: this.fb.control<string | null>(
      '',
      Validators.pattern('[- +()0-9]{6,12}'),
    ),
    site: this.fb.control<string | null>(
      '',
      Validators.pattern(
        '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?',
      ),
    ),
    avatar: this.fb.control<string>(''),
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UsersService,
    private readonly router: Router,
    private readonly imagesService: ImagesService,
  ) {}

  ngOnInit(): void {}

  newUser() {
    this.userService.newUser(this.formGroup.value).subscribe({
      next: () => this.router.navigateByUrl('users'),
      error: (err) => console.error(err),
    });
  }

  onLoadImage(event: Event) {
    const formData = new FormData();
    const target = <HTMLInputElement>event.target;
    if (target.files) {
      formData.append('file', target.files[0]);
      this.imagesService.uploadImage(formData).subscribe({
        next: (result) =>
          this.formGroup.patchValue({
            avatar: result.filename,
          }),
        error: (err) => console.error(err),
      });
    }
  }
}
