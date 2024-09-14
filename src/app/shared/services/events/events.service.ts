import { Injectable } from '@angular/core';
import { UtilService } from '../util/util.service';
import { VariablesService } from '../variables/variables.service';
import { IUser } from '../../model/user.model';
import { throwError } from 'rxjs';
import { ApiService } from '../api/api.service';
import { API_URLS } from 'src/environments/api-urls';

declare let clarity: any;
declare let clevertap: any; // Claver Tap event push
declare let dataLayer: any[]; //GTM Object

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private api: ApiService,
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
      const user: IUser = this.util.getUserData();
      data = this.util.removeEmptyFromObject({
        ...data,
        'x-fb-event_id': +(`${Date.now().toString()}${Math.floor(Math.random() * 10000000).toString()}`),
        'user_data': user ? { email_address: user.email, phone_number: user.phone_1 } : null
      });

      // if (typeof dataLayer === 'undefined') {
      //   await this.isScriptReady('gtm_loaded');
      //   (<any>window).dataLayer.push(data);
      // } else {
      //   dataLayer.push(data);
      // }
    }
  }

  async clarityEventsPush(data: any) {
    if (this.vars.isBrowser) {
      // if (typeof clarity === 'undefined') {
      //   await this.isScriptReady('clarity_loaded');
      //   (<any>window).dataLayer.push(data);
      // } else {
      //   clarity("set", "EntityId", `${data}`);
      // }
    }
  }

  async claverProfilePush(pushObject: any) {
    const phone: string = pushObject?.Site?.Mobile || '';
    const countryCode = '+91';
    if (phone && phone.includes(countryCode)) {
      const phoneArr = [...phone.replace('+91', '')];
      const uniqueStringValues = new Set(phoneArr);
      if (uniqueStringValues.size === 1 || !(/^((\+)?(91))?([0])?([6-9][0-9]{9})$/).test(phone)) {
        const excludeCalls = ['+918657098283', '+919324932708', '+919324932709', '+919324932710', '+919321918898'];
        excludeCalls.forEach(val => {
          pushObject['Site'][val] = 'No';
        });
      }
    }
    pushObject['Site']['MSG-push'] = true;
    pushObject['Site']['MSG-whatsapp'] = true;
    try {
      // if (typeof clevertap === 'undefined') {
      //   await this.isScriptReady('ct_loaded');
      //   (<any>window).clevertap.onUserLogin.push(pushObject);
      // } else {
      //   clevertap.onUserLogin.push(pushObject);
      // }
    } catch (e) {
      // console.log(e);
    }
  }

  async updateCTprofile(data: { name?: string, email?: string, phone?: string }) {
    const pushObject: any = {
      Site: {}
    }
    if (data?.name) {
      pushObject.Site['Name'] = data.name;
    }
    if (data?.email) {
      pushObject.Site['Email'] = data.email;
    }
    if (data?.phone) {
      pushObject.Site['Phone'] = data.phone;
    }
    try {
      // if (typeof clevertap === 'undefined') {
      //   await this.isScriptReady('ct_loaded');
      //   (<any>window).clevertap.profile.push(pushObject);
      // } else {
      //   clevertap.profile.push(pushObject);
      // }
    } catch (e) {
      // console.log(e);
    }
  }

  async claverTapPush(name: string, data: any) {
    const user: IUser = this.util.getUserData();
    data = {
      ...data,
      ...this.vars.utm_url_obj,
      'Page Name': this.vars.pageName,
      'Device Type': this.vars.deviceType,
      'Page URL': data?.pageURL,
      'Page Version': 'Angular',
      'Donor Name': user?.full_name,
      'Email ID': user?.email,
      'Identity': user?.id,
      'Mobile': user?.phone_1 ? ((user?.extension || '') + user.phone_1) : null,
    }
    delete data?.pageURL;

    if (name?.match('New Contribution') && this.vars.fundraiser) {
      data = {
        ...data,
        'Campaign Title': this.vars.fundraiser?.title,
        'Truncated Campaign Title': this.vars.fundraiser.title ? this.util.truncateString(this.vars.fundraiser.title, 20) : null,
        'Campaigner Name': this.vars.fundraiser?.campaigner?.full_name,
        'Beneficiary Name': this.vars.fundraiser?.basicInfo?.beneficiary_name || this.vars.fundraiser?.beneficiaryname?.info_1 || null,
        'Campaign Image URL': this.vars.fundraiser?.gallery?.[0]?.cdn_path || null,
        'Mobile Operating System': this.vars.isMobile ? this.util.getMobileOperatingSystem().toLowerCase() : null
      }

      let campaignLongUrl = `${this.vars.fundraiser.custom_tag}?payment=form&utm_source=external_clevertap&utm_medium=whatsapp&utm_campaign=gs_abc_all_v1_img`;

      if (this.vars.fundraiser.parent_cause_id === 149) {
        campaignLongUrl = `${this.vars.domain_details.fullUrl}/stories/${campaignLongUrl}`;
      } else {
        campaignLongUrl = `${this.vars.domain_details.fullUrl}/fundraiser/${campaignLongUrl}`;
      }
      // const campaignShortURL = await this.getShortURL({
      //   id: `nc-${this.vars.fundraiser.id}`,
      //   long_url: campaignLongUrl,
      // });
      // data['Campaign Short URL'] = campaignShortURL;
    }

    data = this.util.removeEmptyFromObject(data);

    // console.log(`ct data 'name' = ${name}`, data);

    try {
      // if (typeof clevertap === 'undefined') {
      //   await this.isScriptReady('ct_loaded');
      //   (<any>window).clevertap.event.push(name, data);
      // } else {
      //   clevertap.event.push(name, data);
      // }
    } catch (e) {
      // console.log(e);
    }
  }

  onLoadSystemEvent(ePayload: any) {
    if (this.vars.isBrowser) {
      this.sendSystemEvent(ePayload);
    }
  }

  sendSystemEvent(ePayload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.vars.isBrowser) { reject(false); return; }
      if (this.vars.isBrowser && this.skipSystemEvents()) { return throwError(() => { }); }

      const user: IUser = this.util.getUserData();
      ePayload = {
        ...this.setZohoABData(ePayload),
        'referrer_page': document.referrer || this.vars.previousPageUrl,
        'device': this.vars.deviceType,
        'entity_id': user?.id,
        'event_type_id': ePayload?.event_type_id || this.vars.fundraiser?.id || null,
        'page_name': ePayload?.page_name || this.vars.pageName
      }

      ePayload = this.util.removeEmptyFromObject(ePayload);

      // new system event
      // this.api.post(this.vars.domain_details.fullUrl + '/actions/collect', ePayload).subscribe(_ => _);

      // const url = `${this.vars.domain_details.fullUrl}/vars/system_event.php`;
      // this.api.get(url, ePayload, { 'X-Requested-With': 'XMLHttpRequest' }).subscribe(_ => _);
      resolve(true);
      return;
    });
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
      try {
        const zps = (<any>window)?.zps?.getAllABExperiments()[0];
        if (zps && typeof (<any>window).zps !== 'undefined') {
          data['ab_testname'] = zps.experiment_name || '';
          data['ab_value'] = zps.variation_name || 0;
        }
      } catch (error) { }
    }
    return data;
  }

  getShortURL(payload: any): Promise<string | false> {
    return new Promise((resolve, reject) => {
      try {
        this.api.post(API_URLS.GET_SHORT_URL, payload).subscribe({
          next: (res: any) => {
            resolve(res?.data?.data?.short_url || false);
          },
          error: (err: any) => {
            reject(false);
          }
        });
      } catch (error) {
        reject(false);
      }
    });
  }

}
