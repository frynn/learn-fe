import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/shared/interfaces';
import { ImagesService } from 'src/app/shared/services/images.service';
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
    private imagesService: ImagesService,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      usersService.getUser(this.id!).subscribe({
        next: (user) => {
          this.user = user;
          this.downloadImage(this.user.avatar);
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
            avatar: this.fb.control<string>(String(this.user.avatar || '')),
          });
        },
        error: (err) => console.error(err),
      });
    });
  }

  downloadImage(avatar?: string) {
    if (avatar) {
      this.imagesService.getImage(avatar).subscribe((imagePreview) => {
        if (this.user) {
          this.user.imagePreview = imagePreview;
        }
      });
    }
  }

  updateUser() {
    this.usersService.updateUser(this.id!, this.formGroup!.value).subscribe({
      next: () => this.router.navigateByUrl('users'),
      error: (err) => console.error(err),
    });
  }

  onLoadImage(event: Event) {
    const formdata = new FormData();
    const target = <HTMLInputElement>event.target;
    if (target.files) {
      formdata.append('file', target.files[0]);
      this.imagesService.uploadImage(formdata).subscribe({
        next: (result) => {
          this.formGroup?.patchValue({
            avatar: result.filename,
          });
          this.downloadImage(result.filename);
          this.formGroup?.markAsDirty();
        },
        error: (err) => console.error(err),
      });
    }
  }
}
