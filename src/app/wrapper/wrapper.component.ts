import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { LayoutService } from '../shared/services/layout.service';
import { Subscription } from 'rxjs';
import { Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
})
export class WrapperComponent implements OnInit, OnDestroy {
  profile: IUser | null = null;
  sub$ = new Subscription();
  fullWidth = true;

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private readonly layoutService: LayoutService,
  ) {
    this.sub$.add(
      this.layoutService.observe$.subscribe((bp) => {
        this.fullWidth = [
          Breakpoints.XSmall,
          Breakpoints.Small,
          Breakpoints.Medium,
        ].includes(bp);
      }),
    );
  }

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

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }
}
