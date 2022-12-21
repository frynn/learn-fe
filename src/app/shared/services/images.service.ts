import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { mergeMap, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor(
    private readonly http: HttpClient,
    private readonly sanitizer: DomSanitizer,
  ) {}

  uploadImage(
    formData: FormData,
  ): Observable<{ originalname: string; filename: string }> {
    return this.http.post<{ originalname: string; filename: string }>(
      `${environment.apiUrl}/images`,
      formData,
    );
  }

  getImage(imageName: string): Observable<SafeUrl> {
    return this.http
      .get(`${environment.apiUrl}/images/${imageName}`, {
        responseType: 'blob',
      })
      .pipe(
        mergeMap((blob) => {
          const sub$ = new Subject<SafeUrl>();

          let reader = new FileReader();
          reader.onload = () => {
            const safe: any = this.sanitizer.bypassSecurityTrustUrl(
              reader.result?.toString() || '',
            );
            sub$.next(safe);
            sub$.complete();
          };
          reader.readAsDataURL(blob);

          return sub$;
        }),
      );
  }
}
