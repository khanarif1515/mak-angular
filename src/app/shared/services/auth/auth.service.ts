import { Injectable } from '@angular/core';
import { IUser } from '../../model/user.model';
import { UtilService } from '../util/util.service';
import { ApiService } from '../api/api.service';
import { API_URLS } from 'src/environments/api-urls';
import { VariablesService } from '../variables/variables.service';
import { EventsService } from '../events/events.service';
import { environment } from 'src/environments/environment';

interface ILoginWithEmail { em?: string, email?: string, utm_source?: string, name?: string, phone?: string | number, phoneExt?: string, redirect?: string, to?: string }

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private api: ApiService,
    private events: EventsService,
    private util: UtilService,
    private vars: VariablesService
  ) { }

  userLogin(data?: { user?: any, login?: boolean, token?: string }): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      try {
        this.util.setUser(data);
        let userData = await this.getUserDataMeApi();
        if (!userData) { reject(false); return; }

        this.eventsAfterLogin(userData);
        this.vars.userData$.next(userData);
        if (data?.login) {
          const domain = environment.name === 'local' ? 'localhost' : '.' + this.vars.domain_details.url;
          this.util.storage.setCookie('u_auth', data?.token || '', 365, domain);
          this.vars.isPermanentLoggedIn$.next(data?.login || false);
        }

        if (userData?.lastorder) {
          userData = this.setLastOrderInfo(userData);
        }
        resolve(userData);
      } catch (error) {
        reject(false);
      }
    });
  }

  getUserDataMeApi(): Promise<IUser> {
    return new Promise((resolve, reject) => {
      const path = `${API_URLS.GET_USER_ME}?with=avtar;isHospital;listsubscriptions;aggdonationall;activateReward;allActiveCampaigns;lastorder;panNumber;subscriptions;activeSubscription.subscriptionLog;healthDetails;latestUserPolicyDetails;lastHealthFirstOrder.orderPlan`;
      this.api.get(path).subscribe({
        next: (res: any) => {
          if (!res?.data) { reject(false); return; }
          res.data['extension'] = res?.data?.extension || this.vars?.userPhoneExt || '';
          res.data['phone_1'] = res?.data?.phone_1 || this.vars?.userPhoneNumber || '';
          this.util.setUserData(res?.data);
          resolve(res?.data);
        },
        error: (err: any) => {
          reject(false);
        }
      });
    });
  }

  setLastOrderInfo(userData: IUser): IUser {
    const order = userData.lastorder;
    if (order) {
      let info = {
        mode_value: order.payment_mode_value,
        mode: order.payment_mode,
        gateway: order.payment_gateway,
        ...order
      };
      if (order.payment_mode && order.payment_mode.match('UPI')) {
        info.upi_id = order.checksum;
      }
      if (order.checksum && order.payment_gateway && order.payment_gateway.match('stripe')) {
        try {
          const stripeChecksum = JSON.parse(order.checksum);
          if (stripeChecksum) {
            this.vars.stripeUsToken = stripeChecksum.token_1;
            info = Object.assign(info, stripeChecksum);
          }
        } catch (error) {
        }
      }
      userData.lastorder = info;
      return userData;
    } else {
      return userData;
    }
  }

  eventsAfterLogin(user: any) {
    this.events.claverProfilePush({
      'Site': {
        'Identity': user.id,
        'Email': user.email,
        'Name': user.full_name,
        'Phone': user.extension + user.phone_1,
        'Mobile': user.extension + user.phone_1,
        'Full Name For URL': encodeURI(user.full_name),
        'Login_Via': this.vars.loginMethod,
        country_code: user?.extension || ''
      }
    });
  }

  userLoginWithEmail(data: ILoginWithEmail): Promise<IUser> {
    return new Promise((resolve, reject) => {
      try {
        const loginPayload: any = {
          email: data?.em || data?.email || '',
          name: data?.name || '',
          phone: data?.phone || '',
          extension: data?.phoneExt || ''
        };
        const user = this.util.getUser();
        const loggedIn = user?.user?.isLoggedIn;
        if (!this.vars.isVariableLogin && user && loginPayload?.email && (!loggedIn || data?.utm_source?.match('internal_impact_calling|internal_stories_otd_calling'))) {
          this.util.storage.delete('user');
          this.util.storage.delete('userdata');
          this.util.storage.deleteCookie('u_auth', '.ketto.org');
          this.vars.isToken = false;
          this.util.storage.delete('abandonedCart');
          this.util.storage.delete('abandonedCartOtd');
          this.util.storage.deleteFromSession('showBanner');
          this.util.storage.deleteFromSession('sipUserRedirect');
        } else if (!this.vars.isVariableLogin && loggedIn) {
          const userdata = this.util.storage.get('userdata');
          if (data?.redirect) {
            this.redirectTo(data?.to);
          }
          resolve(userdata);
          return;
        }

        if (loginPayload?.email) {
          this.autoLogin(loginPayload).subscribe({
            next: async (res: any) => {
              try {
                const user: IUser = await this.userLogin(res.data);
                if (data?.redirect) {
                  this.redirectTo(data?.to);
                }
                resolve(user);
              } catch (error) {
                reject(undefined);
              }
            },
            error: (err: any) => {
              reject(undefined);
            }
          });
        } else {
          reject(undefined);
        }
      } catch (error) {
        reject(undefined);
      }
    });
  }

  redirectTo(to: string = '/') {
    this.util.router.navigate([to]);
  }

  autoLogin(data: { email: string, name: string, phone: string, extension: string }) {
    this.vars.isToken = false;
    return this.api.post(API_URLS.AUTO_LOGIN, data);
  }

  logout() {
    this.util.storage.delete('user');
    this.util.storage.delete('userdata');
    const domain = environment.name === 'local' ? 'localhost' : '.' + this.vars.domain_details.url;
    this.util.storage.deleteCookie('u_auth', domain);
    this.vars.isToken = this.vars.isPermanentLoggedIn = this.vars.isTempLoggedIn = false;
    this.vars.isPermanentLoggedIn$.next(false);
    this.vars.isTempLoggedIn$.next(false);
    this.vars.userData$.next(undefined);
  }
}
