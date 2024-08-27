import { Injectable } from '@angular/core';
import { UtilService } from '../util/util.service';
import { VariablesService } from '../variables/variables.service';
import { IUser } from '../../model/user.model';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare let dataLayer: any[]; /**GTM Object */
declare let clarity: any;

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private http: HttpClient,
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

  onLoadSystemEvent(ePayload: any) {
    if (this.vars.isBrowser) {
      // this.sendSystemEvent(ePayload).subscribe(_ => _);
    }
  }

  sendSystemEvent(ePayload: any) {
    if (this.vars.isBrowser && this.skipSystemEvents()) {
      return throwError(() => { });
    }
    if (this.vars.isBrowser) {
      ePayload['referrer_page'] = document.referrer || this.vars.previousPageUrl;
      ePayload['device'] = this.vars.deviceType;
      Object.assign(ePayload, this.vars.utm_url_obj);
    }
    const abVars = this.setZohoABData(ePayload);
    if (abVars) {
      ePayload = abVars
    }
    const user: IUser = this.util.getUserData();
    if (user) {
      ePayload['entity_id'] = user.id;
    }
    if (!ePayload?.page_name) { ePayload['page_name'] = this.vars.pageName; }

    // new system event
    // this.http.post(this.vars.domain_details.fullUrl + '/actions/collect', ePayload).subscribe(_ => _);

    // const options = {
    //   headers: new HttpHeaders({ 'X-Requested-With': 'XMLHttpRequest' }),
    //   params: ePayload
    // };
    // return this.http.get(this.vars.domain_details.fullUrl + '/vars/system_event.php', options);
    return;
  }

  skipSystemEvents() {
    let returnVal = false;
    if (this.vars.isBrowser) {
      const nonSysEventsCampaigns = ['test'];
      nonSysEventsCampaigns.forEach((item) => {
        if (window.location.pathname.includes(item)) {
          returnVal = true;
        }
      });
    }
    return returnVal;
  }

  setZohoABData(data: any) {
    if (this.vars.isBrowser) {
      const zps = (<any>window)?.zps?.getAllABExperiments()[0];
      if (zps && typeof (<any>window).zps !== 'undefined') {
        data['ab_testname'] = zps.experiment_name || '';
        data['ab_value'] = zps.variation_name || 0;
        return data;
      }
    }
  }
}
