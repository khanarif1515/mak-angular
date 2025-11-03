import { inject, Injectable } from '@angular/core';
import { VarS } from '../var/var.service';
import { ApiS } from '../api/api';
import { ApiEndPoints } from '../../models/api-endpoints.model';
import { UtilS } from '../util/util';
import { IUser } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly api = inject(ApiS);
  private readonly vars = inject(VarS);
  private readonly util = inject(UtilS);

  getMaskedUserDetails(username: string, params = { skipError: true }): Promise<IUser | null> {
    return new Promise((resolve, reject) => {
      try {
        this.api.request('get', ApiEndPoints.getMaskedUserMe(username), params).subscribe({
          next: (res: any) => {
            this.vars.maskedUser = res?.data;
            resolve(res?.data);
          },
          error: (err) => {
            resolve(null);
          }
        });
      } catch (error) {
        resolve(null);
      }
    });
  }
}
