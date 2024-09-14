import { Injectable } from '@angular/core';
import { VariablesService } from '../variables/variables.service';
import { ApiService } from '../api/api.service';
import { UtilService } from '../util/util.service';
import { ICartParams, IContributeParams, IOrderParams, IPaymentOptions, IPayConfig, PAYMENT_DEFAULT_CONFIG, ICart, ICartCampaign, IContribute, ISendParams, ISendResponse } from '../../model/payment.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { API_URLS } from 'src/environments/api-urls';
import { ABService } from '../AB/ab.service';
import { EventsService } from '../events/events.service';
import { AuthService } from '../auth/auth.service';
import { IUser } from '../../model/user.model';
import { IOrder } from '../../model/order.model';
import { ActivatedRoute } from '@angular/router';
import { IFundraiser } from '../../model/fundraiser.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  captchaResponse?: string;
  cartParams?: ICartParams;
  cart?: ICart;
  failedCart?: ICart;
  cartCampaign?: ICartCampaign;
  configUpdated$ = new BehaviorSubject<boolean>(false);
  contributeRes?: IContribute;
  isContributeInitEventHit = false;
  isUpiMode: boolean = false;
  loading = false;
  orderParams?: IOrderParams;
  orderRes?: IOrder;
  payConfig: IPayConfig = { ...PAYMENT_DEFAULT_CONFIG };
  optionsRes?: IPaymentOptions;
  paymentType: 'standard' | 'custom' = 'standard';
  updateConfig$ = new Subject<IPayConfig>();
  sendApiParams?: ISendParams;
  sendApiRes?: ISendResponse;
  qParams: any;

  constructor(
    private actRoute: ActivatedRoute,
    private AB: ABService,
    private api: ApiService,
    private auth: AuthService,
    private events: EventsService,
    private vars: VariablesService,
    private util: UtilService
  ) {
    this.resetPaymentConfig();
    this.updateConfig$.subscribe(res => {
      if (res) {
        this.payConfig = { ...this.payConfig, ...res };
        this.configUpdated$.next(true);
      }
    });
    this.actRoute.queryParams.subscribe(p => {
      this.qParams = { ...p };
    });
  }

  resetPaymentConfig() {
    this.cartParams = this.cart = this.cartCampaign = this.contributeRes = this.orderParams = this.orderRes = this.sendApiParams = this.sendApiRes = this.optionsRes = this.captchaResponse = undefined;
    this.payConfig = { ...PAYMENT_DEFAULT_CONFIG };
  }

  getContributeFormDetails(data: IContributeParams) {
    return new Promise((resolve, reject) => {
      try {
        if (!data?.campaign_id || !data?.currency) {
          reject(false);
          return;
        }

        const contributePayload = {
          ...data,
          'no_pan_change': true,
          'update_multiplier': true,
          'origin': this.vars.origin,
          'device': this.vars.deviceType,
          'is_story': this.vars.origin === 's' ? true : null,
          'pcurrency': data?.previousCurrency,
          'slab_ab': this.AB.slab_AB() || null
        };

        delete contributePayload?.previousCurrency;

        const path = API_URLS.GET_CONTRIBUTE_OTD(data?.campaign_id) + '?' + this.util.objectToUrlString(contributePayload);

        this.vars.showSkeletonFor.slab = true;
        this.loading = true;
        this.api.get(path).subscribe({
          next: (res: any) => {
            if (!res?.data?.data) { this.loading = false; reject(false); return; }
            this.contributeRes = {
              ...res.data.data,
              timestamp: new Date().getTime()
            };
            this.updateConfig$.next({ contributeRes: this.contributeRes });
            this.vars.supportedCurrency = this.vars.currencies.filter(val => this.contributeRes?.supported_currency.includes(val.currency));
            if (!this.isContributeInitEventHit) {
              this.eventForInitiatePayment();
            }
            this.sendDonationSlabEvent();
            this.loading = false;
            this.vars.showSkeletonFor.slab = false;
            resolve(this.contributeRes);
          },
          error: (err: any) => {
            this.loading = false;
            this.vars.showSkeletonFor.slab = false;
            this.util.openSnackBar(err?.error?.message, 'error');
            reject(false);
          }
        });
      } catch (error) {
        this.loading = false;
        reject(false);
      }
    });
  }

  getOptionsDetails(currency: string) {
    return new Promise((resolve, reject) => {
      try {
        if (!currency || !this.cart) { reject(false); return; }

        if (this.paymentType === 'standard') {
          this.optionsRes = {
            gateway: 'eqall'
          };
          this.updateConfig$.next({ optionsRes: this.optionsRes });
          resolve(this.optionsRes);
          return;
        }

        const userData = this.vars.userData$.getValue();

        const optionsPayload = {
          currency: currency,
          amount: this.cart?.donated_amount,
          mobile_no: this.cart?.donor_phone || userData?.phone_1,
          recurring: this.cart?.recurring || undefined,
          is_mobile: this.util.isMobile() ? 1 : 0,
          mode: this.isUpiMode ? 'UPI' : undefined
        }

        const path = API_URLS.GET_PAYMENT_OPTIONS + '?' + this.util.objectToUrlString(optionsPayload);
        this.loading = true;
        this.api.get(path).subscribe({
          next: (res: any) => {
            this.optionsRes = { ...res?.data };
            this.updateConfig$.next({ optionsRes: this.optionsRes });
            this.loading = false;
            resolve(res?.data);
          },
          error: (err: any) => {
            this.loading = false;
            this.util.openSnackBar(err?.error?.message, 'error');
            reject(false);
          }
        });
      } catch (error) {
        reject(false);
      }
    });
  }

  createCart(data: ICartParams) {
    return new Promise((resolve, reject) => {
      try {

        if (!data?.campaign_id || !data?.currency || !data?.donated_amount || !data?.donor_name || !data?.donor_email || !data?.donor_extension || !data?.donor_phone) {
          reject(false);
          return;
        }

        const clientLocationData = this.vars.clientLocationData$.getValue();
        const payload = {
          ...data,
          'donated_amount': data?.bulkAmount || data?.donated_amount,
          'donor_phone': data.donor_phone?.toString()?.replace(/\s/g, ''),
          'is_anonymous': data?.is_anonymous || '0', // '0' or '1'
          'donor_country': clientLocationData?.country_name,
          'donor_city': clientLocationData?.city_name,
          'g-recaptcha-response': this.captchaResponse || undefined,
          'device': this.vars.deviceType
        };

        delete payload?.bulkAmount;

        const cartPayload = this.util.removeEmptyFromObject(payload);

        this.loading = true;
        const path = API_URLS.CREATE_CART(data?.campaign_id);
        this.api.post(path, cartPayload).subscribe({
          next: async (res: any) => {
            if (!res?.data?.cart) { this.loading = false; reject(false); return; }

            if (this.vars.isDummyEmail) {
              this.events.updateCTprofile({ name: payload?.donor_name, email: payload?.donor_email });
            }

            const cartData = {
              ...res.data,
              timestamp: new Date().getTime()
            }
            this.vars.userPhoneExt = `${cartData.cart.donor_extension}`;
            this.vars.userPhoneNumber = `${cartData.cart.donor_phone}`;
            const userData = this.vars.userData$.getValue();
            if (userData && !userData?.phone_1) {
              userData.extension = this.vars.userPhoneExt;
              userData.phone_1 = this.vars.userPhoneNumber;
              this.util.setUserData(userData);
            }

            if (this.contributeRes?.ask_citizenship) {
              cartData.cart.indian = this.payConfig?.isIndian ? true : '0';
            }

            if (cartData?.token && !this.vars.authToken) {
              this.vars.loginMethod = 'cart';
              await this.auth.userLogin({ user: cartData.user, token: cartData.token, login: cartData.login });
            }

            this.cart = cartData?.cart;
            this.cartCampaign = cartData?.campaign;
            this.updateConfig$.next({ cartResponse: cartData });

            this.eventAfterCreatingCart();

            this.cart = {
              ...this.cart,
              tip_amount: data?.tip_amount || undefined,
              tip_amount_perc: data?.tip_amount_perc || undefined
            }

            this.util.storage.checkFromSession('cartData', { cart: this.cart, campaign: this.cartCampaign });
            this.loading = false;
            resolve(cartData);
          },
          error: (err: any) => {
            this.loading = false;
            this.util.openSnackBar(err?.error?.message, 'error');
            reject(false);
          }
        });

      } catch (error) {
        reject(false);
      }
    });
  }

  createOrder(data?: IOrderParams) {
    return new Promise((resolve, reject) => {

      this.orderParams = {
        ...data,
        campaign_id: data?.campaign_id || this.cart?.campaign_id,
        cart_id: this.cart?.id,
        gateway: this.optionsRes?.gateway,
        bin: data?.mode === 'CARD' && !data?.customer_id && data?.card_number_fill ? data?.card_number_fill?.substring(0, 6) : null,
        page_type: this.vars.pageName,
        vpa: data?.VPA,
        is_indian: this.cart?.indian,
        is_multi_patient_campaign: this.vars.donateMultiPatient || undefined,
        support_campaign_id: this.vars.fundraiser?.support_campaign?.id
      };

      delete this.orderParams?.card_number_fill;
      delete this.orderParams?.VPA;

      if (this.orderParams?.vpa && this.vars.recommendedVpa && this.orderParams?.vpa !== this.vars.recommendedVpa) {
        this.events.sendSystemEvent({
          eventName: 'vpa_changed',
          info_1: 'new vpa = ' + this.orderParams?.vpa,
          info_2: 'old vpa = ' + this.vars.recommendedVpa
        });
      }

      const orderPayload = this.util.removeEmptyFromObject(this.orderParams);

      this.loading = true;
      const path = API_URLS.CREATE_ORDER(this.cart?.campaign_id || this.vars.fundraiser?.id);
      this.api.post(path, orderPayload).subscribe({
        next: async (res: any) => {
          this.orderRes = res?.data;
          this.eventAfterCreatingOrder();
          this.util.storage.checkFromSession(this.orderRes?.order_id || '', this.cart);
          this.loading = false;
          if (this.paymentType === 'standard') {
            resolve(await this.sendOrder());
          } else {
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.util.openSnackBar(err?.error?.message, 'error');
          reject(false);
        }
      });
    });
  }

  sendOrder() {
    return new Promise((resolve, reject) => {
      try {
        const userData = this.vars.userData$.getValue();
        this.vars.tyParams = {
          ...this.qParams,
          id: this.orderRes?.campaign_id,
          or: this.vars.origin,
          dnr: userData?.aggdonationall?.funds ? 'rp' : 'fs',
          lpm: this.orderRes?.payment_gateway?.match('stripe') ? 'strp' : 'nstrp',
          url: this.util.router.url.split('?')[0],
          donated_currency: this.orderRes?.iso_currency,
          donated_amount: this.orderRes?.donated_amount,
          tip_amount: this.orderRes?.tip_amount || null,
          amt: this.cart?.recurring ? this.orderRes?.donated_amount : null,
          ct: this.cartCampaign?.custom_tag,
          oi: this.orderRes?.order_id,
          u_or: this.qParams?.or,
          sub_campaign_id: this.orderRes?.sub_campaign_id
        };
        if (!this.vars.tyParams) { reject(true); return; }

        if (this.vars.fundraiser?.is_multi_patient_campaign) {
          this.vars.tyParams.multi_patient_opted = this.vars.donateMultiPatient || 0;
        }

        delete this.vars.tyParams?.page;
        delete this.vars.tyParams?.st;
        delete this.vars.tyParams?.last_success_order_id;
        delete this.vars.tyParams?.payment;
        delete this.vars.tyParams?.method;
        delete this.vars.tyParams?.method_type;

        this.vars.tyParams = this.util.removeEmptyFromObject(this.vars.tyParams);
        this.util.storage.addSessionData('payment_return_params', { p_params: JSON.stringify(this.vars.tyParams), ...this.vars.tyParams });

        this.sendApiParams = {
          ...this.sendApiParams,
          order_id: this.orderRes?.order_id,
          return_url: `${this.vars.domain_details.fullUrl}/payment-route?${this.util.objectToUrlString(this.vars.tyParams)}`
        };

        this.loading = true;
        this.api.post(API_URLS.SEND_ORDER, this.sendApiParams).subscribe({
          next: (res: any) => {
            this.sendApiRes = res?.data;
            if (!this.sendApiRes) { reject(false); return; }

            if (res?.data?.charged && res?.data?.status === 'success') {
              this.goToThankYouPage();
              this.loading = false;
              resolve(true);
              return;
            }

            if (res?.data?.charged === false) {
              this.redircetToPaymentGateway();
            }
          },
          error: (err: any) => {
            this.loading = false;
            this.util.openSnackBar(err?.error?.message, 'error');
            reject(false);
          }
        });
      } catch (error) {
        reject(false);
      }
    });
  }

  goToThankYouPage() {
    this.util.router.navigate(['/thankyou'], { queryParams: this.vars.tyParams }).then(() => {
      this.util.dialog.closeAll();
      this.util.sheet.dismiss();
      this.util.storage.deleteFromSession(this.orderRes?.order_id || '');
    });
  }

  redircetToPaymentGateway() {
    const orderParams: any = { ... this.orderParams };
    let redirectParams: any;
    if (this.sendApiRes?.params) {
      redirectParams = { ...this.sendApiRes?.params };
      Object.entries(this.sendApiRes.params).forEach((val: any, key) => {
        if (orderParams?.hasOwnProperty(val)) {
          redirectParams[key] = orderParams[val]?.toString();
        }
      });
    }

    const frm = document.createElement('form');
    frm.setAttribute('method', this.sendApiRes?.method || '');
    frm.setAttribute('action', this.sendApiRes?.url || '');
    frm.setAttribute('id', 'payment_form');
    frm.setAttribute('class', 'juspay_inline_form'); // Class for juspay payment gateway

    if (redirectParams) {
      for (const key of Object.keys(redirectParams)) {
        const value = redirectParams[key];
        const field = document.createElement('input');
        field.setAttribute('type', 'hidden');
        field.setAttribute('name', key);
        field.setAttribute('class', key);
        field.setAttribute('value', value);
        frm.appendChild(field);
      }
    }
    document.body.appendChild(frm);
    frm.submit();
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  getPaymentStatus(data: any) {
    return this.api.post(API_URLS.GET_PAYMENT_STATUS(data?.oi), data);
  }

  addCriticalIllness(entity_id: number, order_id: string, selectedIllness: { person: number, cover: string, illnessAmount: number }) {
    const payload = {
      info_1: JSON.stringify({
        person: selectedIllness?.person,
        cover: selectedIllness?.cover,
        add_on_price: selectedIllness?.illnessAmount
      }),
      info_2: order_id,
      info_type: 'critical_illness'
    };
    this.api.put(API_URLS.ADD_CRITICAL_ILLNESS(entity_id), payload).subscribe({
      next: (resp) => {
      }
    });
  }

  sendDonationSlabEvent() {
    if (this.contributeRes) {
      const systemEvent = {
        eventName: 'Donation_Slabs',
        event_type: 'campaign',
        info_1: JSON.stringify(this.contributeRes.slabs),
      };
      this.events.sendSystemEvent(systemEvent);
    }
  }

  eventForInitiatePayment(position = 11) {
    return new Promise((resolve, reject) => {
      try {
        const claverTapProperty: any = {
          'Position': 11,
          'Cart ID': this.vars.fundraiser?.id,
          'Custom Tag': this.vars.fundraiser?.custom_tag
        };
        this.events.claverTapPush('Contribution Initiated', claverTapProperty);
        const dataLayer = {
          'event': 'Contribution Initiated',
          'event_category': 'Contribution Initiated',
          'event_action': 'click',
          'event_label': this.vars.fundraiser?.title,
          'Campaign_custom_tag': this.vars.fundraiser?.custom_tag,
          'Campaign_cause_id': this.vars.fundraiser?.cause_id,
          'Campaign_id': this.vars.fundraiser?.id,
          'Campaign_Type': this.util.getCampaignTypeFromId(this.vars.fundraiser?.parent_cause_id),
          'position': position,
          sip: this.vars?.gtmPageData?.sip || false
        };
        this.events.gtmPush(dataLayer);

        let info3 = this.vars.pageName;
        if (this.vars.eventInfos.contributeInitiate.info_3) {
          info3 += `,${this.vars.eventInfos.contributeInitiate.info_3}`;
        }

        const systemEvent = {
          eventName: 'Contribution Initiated',
          event_type: 'campaign',
          event_type_id: this.vars.fundraiser?.id,
          info_1: this.vars.eventInfos.contributeInitiate.info_1,
          info_2: this.vars.eventInfos.contributeInitiate.info_2,
          info_3: info3
        };
        this.events.sendSystemEvent(systemEvent);
        resolve(true);
      } catch (error) {
        reject(false);
      }
    });
  }

  eventAfterCreatingCart() {
    return new Promise((resolve, reject) => {
      try {

        let info1 = this.contributeRes?.slabs?.length ? `${JSON.stringify(this.contributeRes.slabs)}/${this.cart?.donated_amount}` : '';
        if (this.vars.eventInfos.contributeCart.info_1) {
          info1 = `${info1},${this.vars.eventInfos.contributeCart.info_1}`;
        }
        let info2: any = this.cart?.id;
        if (this.vars.eventInfos.contributeCart.info_2) {
          info2 = `${info2},${this.vars.eventInfos.contributeCart.info_2}`;
        }
        let info3 = this.vars.pageName;
        if (this.vars.eventInfos.contributeCart.info_3) {
          info3 += `,${this.vars.eventInfos.contributeCart.info_3}`;
        }
        if (this.vars.fundraiser?.is_multi_patient_campaign && this.vars?.fundraiser?.is_multi_patient?.info_1 === '1' && this.vars.pageName.match('stories')) {
          info3 += this.vars.donateMultiPatient ? ',multi_p_enabled' : ',multi_p_disabled';
        }

        const systemEvent = {
          eventName: 'Contribution Cart',
          event_type: 'campaign',
          event_type_id: this.cart?.campaign_id,
          info_1: info1,
          info_2: info2,
          info_3: info3
        };
        this.events.sendSystemEvent(systemEvent);

        const dataLayerCartCreate = {
          event: 'crto_basketpage',
          currency: this.cart?.currency,
          crto: {
            email: this.cart?.donor_email,
            products: [{
              id: this.cart?.campaign_id,
              price: this.cart?.donated_amount,
              quantity: '1'
            }]
          }
        };
        this.events.gtmPush(dataLayerCartCreate);

        const claverTapProperty: any = {
          'id': this.cart?.campaign_id,
          'Step': 1,
          'Name': this.cart?.donor_name,
          'Email': this.cart?.donor_email,
          'NC Email ID': this.cart?.donor_email,
          'Type_AB': 'typeAB',
          'Custom Tag': this.cartCampaign?.custom_tag || this.vars.fundraiser?.custom_tag,
          'Parent Cause Id': this.cartCampaign?.parent_cause_id || this.vars.fundraiser?.parent_cause_id,
          'iso_currency': this.cart?.currency,
          'amount': this.cart?.donated_amount,
          'TipAmount': this.cart?.tip_amount,
          'Cart ID': this.cart?.id,
          'Recurring': this.cart?.recurring ? true : false
        };
        if (this.cart?.reward_id) {
          claverTapProperty['Amount'] = this.cart?.donated_amount_inr;
          claverTapProperty['Reward'] = this.cart?.reward_id;
        }
        this.events.claverTapPush('New Contribution', claverTapProperty);

        const campaignType = `${this.util.getCampaignTypeFromId(this.cartCampaign?.parent_cause_id || this.vars.fundraiser?.parent_cause_id)}`;
        const gtmCheckout = {
          'event': 'addToCart',
          'sip': this.cart?.recurring,
          'value': this.cart?.donated_amount_inr,
          'currency': this.cart?.currency,
          'ecommerce': {
            'add': {
              'products': [{
                'name': `${this.cartCampaign?.custom_tag || this.vars.fundraiser?.custom_tag}`,
                'id': `${this.cart?.campaign_id || this.vars.fundraiser?.id}`,
                'category': campaignType,
                'variant': `${this.cartCampaign?.cause_id || this.vars.fundraiser?.cause_id}`,
                'price': this.cart?.donated_amount_inr,
                'quantity': 1,
                'dimension5': '',
                'dimension6': this.cart?.currency,
                'dimension7': `${this.cartCampaign?.cause_id || this.vars.fundraiser?.cause_id}`,
                'dimension8': `${this.cartCampaign?.custom_tag || this.vars.fundraiser?.custom_tag}`,
                'dimension9': `${this.cart?.campaign_id || this.vars.fundraiser?.id}`,
                'dimension10': campaignType,
                'dimension15': this.cart?.donated_amount_inr,
                'dimension16': this.vars.selectTipPercentage || '',
                'dimension17': this.cart?.tip_amount_inr,
              }]
            }
          }
        };
        this.events.gtmPush(gtmCheckout);
        resolve(true);
      } catch (error) {
        reject(false);
      }
    });
  }

  eventAfterCreatingOrder() {
    return new Promise((resolve, reject) => {
      try {
        const claverTap = {
          'id': this.cart?.campaign_id,
          'Step': 3,
          'Name': this.cart?.donor_name,
          'Email': this.cart?.donor_email,
          'Amount': this.orderRes?.donated_amount_local,
          'Payment Mode': this.orderRes?.payment_mode,
          'Type_AB': 'typeAB',
          'TipAmount': this.orderRes?.tip_amount_local,
          'Iso Currency': this.orderRes?.iso_currency,
          'Cart ID': this.cart?.id,
          'Recurring': this.cart?.recurring ? true : false
        };
        this.events.claverTapPush('New Contribution Step 3', claverTap);

        this.checkoutGTMEvent(2);

        let info1 = `${JSON.stringify(this.contributeRes?.slabs)}/${this.orderRes?.donated_amount}`;
        if (this.vars.eventInfos.orderCreated.info_1) {
          info1 += `,${this.vars.eventInfos.orderCreated.info_1}`;
        }
        let info2: any = this.orderRes?.id;
        if (this.vars.eventInfos.orderCreated.info_2) {
          info2 += `,${this.vars.eventInfos.orderCreated.info_2}`;
        }
        let info3 = this.vars.pageName;
        if (this.vars.eventInfos.orderCreated.info_3) {
          info3 += `,${this.vars.eventInfos.orderCreated.info_3}`;
        }
        if (this.vars.fundraiser?.is_multi_patient_campaign && this.vars?.fundraiser?.is_multi_patient?.info_1 === '1' && this.vars.pageName.match('stories')) {
          info3 += this.vars.donateMultiPatient ? ',multi_p_enabled' : ',multi_p_disabled';
        }

        const systemEvent = {
          'eventName': 'order_created',
          'event_type': 'campaign',
          'event_type_id': this.cart?.campaign_id,
          'page_name': this.vars.pageName || '',
          'info_1': info1,
          'info_2': info2,
          'info_3': info3
        };
        this.events.sendSystemEvent(systemEvent);
        resolve(true);
      } catch (error) {
        reject(false);
      }
    });
  }

  checkoutGTMEvent(step: number) {
    const gtmCheckout = {
      'event': 'checkout',
      // 'sip': this.sip,
      'value': this.orderRes?.donated_amount,
      'currency': this.orderRes?.iso_currency,
      'ecommerce': {
        'checkout': {
          'actionField': { 'step': step, 'option': this.orderRes?.payment_mode },
          'products': [{
            'name': this.vars.fundraiser?.custom_tag,
            'id': this.vars.fundraiser?.id,
            'category': this.util.getCampaignTypeFromId(this.vars.fundraiser?.parent_cause_id),
            'variant': this.vars.fundraiser?.cause_id,
            'price': this.orderRes?.donated_amount,
            'quantity': 1,
            'dimension5': '',
            'dimension6': this.orderRes?.iso_currency,
            'dimension7': this.vars.fundraiser?.cause_id,
            'dimension8': this.vars.fundraiser?.custom_tag,
            'dimension9': this.vars.fundraiser?.id,
            'dimension10': this.util.getCampaignTypeFromId(this.vars.fundraiser?.parent_cause_id),
            'dimension15': this.orderRes?.donated_amount,
            'dimension16': this.vars.selectTipPercentage || '',
            'dimension17': this.orderRes?.tip_amount_inr
          }]
        }
      }
    };
    this.events.gtmPush(gtmCheckout);
  }

  succesfullOrderEvents(order: IOrder, fundraiser?: IFundraiser) {
    const gtmPurchased = {
      'event': 'purchase',
      'sip': order.subscription_id ? true : false,
      'transaction_id': order.order_id,
      'value': order.donated_amount_local,
      'currency': order.iso_currency,
      'ecommerce': {
        'purchase': {
          'actionField': {
            'id': order.order_id,
            'revenue': order.donated_amount,
          },
          'products': [{
            'name': fundraiser?.custom_tag,
            'id': fundraiser?.id,
            'category': this.util.getCampaignTypeFromId(fundraiser?.parent_cause_id),
            'variant': fundraiser?.cause_id,
            'price': order.donated_amount,
            'quantity': 1,
            'dimension5': '',
            'dimension7': fundraiser?.cause_id,
            'dimension8': order.donor_first_name,
            'dimension9': fundraiser?.id,
            'dimension10': this.util.getCampaignTypeFromId(fundraiser?.parent_cause_id),
            'dimension15': order.donated_amount,
            'dimension16': this.vars.selectTipPercentage || '',
            'dimension17': order.tip_amount
          }],
          'amount_slab': this.getAmount_slab(order?.donated_amount || 0)
        }
      }
    };
    this.events.gtmPush(gtmPurchased);
  }

  getAmount_slab(value: number) {
    switch (true) {
      case value > 1 && value <= 500:
        return 'Purchase_500';
      case value > 500 && value <= 1000:
        return 'Purchase_1000';
      case value > 1000 && value <= 1500:
        return 'Purchase_1500';
      case value > 1500 && value <= 2000:
        return 'Purchase_2000';
      case value > 2000 && value <= 5000:
        return 'Purchase_5000';
      case value > 5000:
        return 'Purchase_5000plus';
    }
    return null;
  }

  userEventsAfterPayment(order: IOrder, fundraiser?: IFundraiser, userData?: IUser, queryParams?: any) {
    const claverTap: any = {
      'Campaign Name': `${fundraiser?.title}`,
      'Urlencode Campaign Name': encodeURI(fundraiser?.title || ''),
      'Truncated Campaign Name': (fundraiser?.title && fundraiser.title.length > 20) ? fundraiser?.title?.substring(0, 20).concat('...') : fundraiser?.title,
      'Campaign Id': `${fundraiser?.id}`,
      'Amount': `${order.donated_amount_local}`,
      'Reward Id': `${order.rewards_id}`,
      'Charged ID': `${order.order_id}`,
      'Cause ID': `${fundraiser?.cause_id}`,
      'Device Type': this.vars.deviceType,
      'Page Version': 'Angular',
      'Type_AB': '',
      'Donor Name': userData?.full_name,
      'Email ID': userData?.email,
      'Beneficiary Name': fundraiser?.beneficiary?.full_name || '',
      'Parent Cause ID': fundraiser?.parent_cause_id,
      'Description Of Campaign': (fundraiser?.basicInfo?.about && fundraiser?.basicInfo?.about.length > 160) ? fundraiser?.basicInfo?.about?.substring(0, 160).concat('...') : fundraiser?.basicInfo?.about || '',
      'Custom Tag': fundraiser?.custom_tag,
      'ISO Currency': order.iso_currency,
      'Identity': userData?.id || 0,
      'Monthly giving': order.recurring ? 'Yes' : 'No',
      'Tip Added': order?.tip_amount_local ? 'Yes' : 'No',
      'Tip Amount': order?.tip_amount_local || '',
      'Payment mode': order?.payment_mode,
      'NGO ID': fundraiser?.entity_details_id,
      'Event ID': fundraiser?.event_entity_details_id,
      'Update Page URL': `${this.vars.domain_details.fullUrl}/campaign/campaign_update?fmd_id=${fundraiser?.id}&email=${userData?.email}&is_donor=1&donated_amount=${order.donated_amount}&donated_currency=${order.iso_currency}&tyvideobtd=true`,
      'Multipatient Page': order?.is_multi_patient_campaign ? 'Yes' : 'No'
    };

    if (order?.is_multi_patient_campaign) {
      claverTap['New Beneficiary Name'] = order?.sub_campaign?.beneficiaryname?.info_1;
      claverTap['Child Campaign Id'] = order?.sub_campaign?.id;
    }

    if (order.transaction_return_status === '200') {
      this.events.claverTapPush('Charged', this.util.removeEmptyFromObject(claverTap));
    }

    if (order.recurring) {
      const recurringOrder: any = {
        'Name': userData?.full_name,
        'Amount': order.donated_amount,
        'BeneficiaryName': fundraiser?.beneficiary?.full_name || '',
        'CampaignerName': fundraiser?.campaigner?.full_name,
        'CampaignName': fundraiser?.title,
        'CampaignID': fundraiser?.id,
        'Subscription date': Math.round(new Date(order.recurring.creation_time).getTime() / 1000),
        'SubscriptionMonths': order.recurring.tenure,
        'Payment Mode Type': order.payment_mode,
        'Subscription ID': order.subscription_id,
        'LocalAmount': order.donated_amount_local,
        'LocalCurrency': order.iso_currency,
        // 'Coupon Added': order.offer || false
        'Coupon Added': order.coupon || '',
        'Charge Cause': order?.recurring?.campaign_cause,
        'User Type': queryParams?.utm_source || '',
        'Next Deduction Date': (new Date(order?.recurring?.next_payment_date))?.toLocaleDateString('en-GB')?.split('/')?.join('-'),
        'Next Deduction Amount': order?.recurring?.amount,
        'Donation date': (new Date(order?.creation_date))?.toLocaleDateString('en-GB')?.split('/')?.join('-'),
        'Transaction ID': order?.order_id
      };

      let cause_list = '';
      let amount_list = '';
      if (queryParams?.sip_cause && typeof queryParams?.sip_cause === 'object' && queryParams?.sip_cause?.length > 1) {
        queryParams?.sip_cause.forEach((element: any, i: number) => {
          cause_list = cause_list + `${element?.sip_cause || element}${i < queryParams?.sip_cause?.length - 1 ? ',' : ''}`
          amount_list = amount_list + `${userData?.listsubscriptions?.[element?.sip_cause || element]?.amount}${i < queryParams?.sip_cause?.length - 1 ? ',' : ''}`
        });
        recurringOrder['multi_cause'] = true;
        recurringOrder['cause_list'] = cause_list;
        recurringOrder['amount_list'] = amount_list;
      }

      this.events.claverTapPush('Monthly Giving Impact', this.util.removeEmptyFromObject(recurringOrder));
    }

    const profilePushData: any = {
      'last_charged_amount': order.donated_amount_local,
      'last_charged_tip_amount': order.tip_amount_local,
      'last_charged_beneficiaryname': fundraiser?.beneficiary?.full_name,
      'last_charged_campaignid': fundraiser?.id,
      'last_charged_campaignname': fundraiser?.title,
      'last_charged_orderid': order.order_id,
      'last_charged_customtag': fundraiser?.custom_tag,
      'last_charged_descriptionofcampaign': (fundraiser?.basicInfo?.about && fundraiser?.basicInfo?.about.length > 160) ? fundraiser?.basicInfo?.about?.substring(0, 160).concat('...') : fundraiser?.basicInfo?.about || '',
      'last_charged_identity': userData?.id || 0,
      'last_charged_email_id': userData?.email || '',
      'last_charged_isocurrency': order.iso_currency,
      'last_charged_parentcauseid': fundraiser?.parent_cause_id,
      'last_charged_mobilenumber': userData?.phone_1 || '',
      'SIP Active Donor': userData?.listsubscriptions?.medical ? 'Yes' : 'No',
    };

    if (!userData?.hasOwnProperty('listsubscriptions')) {
      profilePushData['SIP Active Donor'] = null;
    }

    if ((order.payment_gateway === 'stripe' || order.payment_gateway === 'stripe_india') && !userData?.listsubscriptions?.medical) {
      profilePushData['eligible_for_one_click_activation'] = 'Yes';
    }

    // User attributes using charged events
    this.events.claverProfilePush({ 'Site': this.util.removeEmptyFromObject(profilePushData) });

    // Criteo Sales dataLayer
    const criteoDataLayer = {
      event: 'crto_transactionpage',
      currency: `${order.iso_currency}`,
      crto: {
        email: `${userData?.email || ''}`,
        transactionid: `${order.id}`,
        products: [{
          id: `${fundraiser?.id}`,
          price: `${order.donated_amount_local}`,
          quantity: '1'
        }]
      }
    };
    this.events.gtmPush(criteoDataLayer);
  }

}
