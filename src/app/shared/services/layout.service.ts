import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';

export const displayNameMap = [
  Breakpoints.XSmall,
  Breakpoints.Small,
  Breakpoints.Medium,
  Breakpoints.Large,
  Breakpoints.XLarge,
];

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  observe$: Observable<string>;

  constructor(private readonly breakpointObserver: BreakpointObserver) {
    this.observe$ = this.breakpointObserver.observe(displayNameMap).pipe(
      map(({ breakpoints }) => {
        for (const bp of displayNameMap) {
          if (!breakpoints[bp]) {
            continue;
          }
          return bp;
        }

        return 'none';
      }),
    );
  }
}
