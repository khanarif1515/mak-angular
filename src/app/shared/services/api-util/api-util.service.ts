import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiUtilService {
  private readonly api = inject(ApiService);

  getDomain() {
    return new Promise((resolve: any, reject: any) => {
      this.api.request('get', 'getdomain').subscribe({
        next: (res: any) => {
          console.log(res);
          if (!res?.data) {
            resolve(null);
            return;
          }
          resolve(res?.data);
        },
        error: (err: any) => {
          resolve(null);
          return;
        }
      });
    });
  }
}
