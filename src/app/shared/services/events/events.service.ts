import { Injectable } from '@angular/core';
import { UtilService } from '../util/util.service';
import { VariablesService } from '../variables/variables.service';
import { IUser } from '../../model/user.model';

declare let dataLayer: any[]; /**GTM Object */
declare let clarity: any;

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private util: UtilService,
    private vars: VariablesService
  ) { }

  isScriptReady(name: string) {
    return new Promise((resolve, reject) => {
      try {
        if (this.vars.isBrowser) {
          document.addEventListener(name, () => resolve(true));
        }
      } catch (error) {
        reject(false);
      }
    });
  }

  async gtmPush(data: any) {
    if (this.vars.isBrowser) {
      data['x-fb-event_id'] = +(`${Date.now().toString()}${Math.floor(Math.random() * 10000000).toString()}`);
      const user: IUser = this.util.getUserData();
      if (user) {
        data['user_data'] = {
          email_address: user.email,
          phone_number: user.phone_1
        };
      }
      if (typeof dataLayer === 'undefined') {
        await this.isScriptReady('gtm_loaded');
        (<any>window).dataLayer.push(data);
      } else {
        dataLayer.push(data);
      }
    }
  }

  async clarityEventsPush(data: any) {
    if (this.vars.isBrowser) {
      if (typeof clarity === 'undefined') {
        await this.isScriptReady('clarity_loaded');
        (<any>window).dataLayer.push(data);
      } else {
        clarity("set", "EntityId", `${data}`);
      }
    }
  }
}
