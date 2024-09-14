import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { clevertap_script, gtm_script, microsoft_clarity } from './external_js';

export const ScriptStore = [
  {
    name: 'googlemaps',
    src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDCF-b1N89za5IiNd95L27vx-XyFzUeoCE&callback&libraries=places'
  },
  {
    name: 'facebooksdk',
    src: 'https://connect.facebook.net/en_US/all.js'
  },
  {
    name: 'intl_tel_input',
    src: '/assets/js/intl-tele-input.js',
    // src: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/14.0.7/js/intlTelInput.min.js'
  },
  {
    name: 'intl_tel_input_util',
    src: '/assets/js/intl-tele-input-util.js',
    // src: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/14.0.7/js/utils.js'
  },
  {
    name: 'gcse',
    src: 'https://cse.google.com/cse.js?cx=009727578198181226831:wayabw0ziuy'
  },
  {
    name: 'webfont',
    src: 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'
  },
  {
    name: 'stripe',
    src: 'https://js.stripe.com/v2/'
  },
  {
    name: 'jquery',
    src: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'
  },
  {
    name: 'pusher',
    src: `https://cdnjs.cloudflare.com/ajax/libs/pusher/4.3.1/pusher.min.js`
  },
  {
    name: 'twitter',
    src: `https://platform.twitter.com/widgets.js`
  },
  {
    name: 'vwo',
    src: 'assets/js/vwo.js'
  },
  {
    name: 'gtm',
    src: gtm_script
  },
  ,
  {
    name: 'clevertap',
    src: clevertap_script
  },
  {
    name: 'razor_pay',
    src: 'https://checkout.razorpay.com/v1/checkout.js'
  },
  {
    name: 'razor_pay_card',
    src: 'https://checkout.razorpay.com/v1/razorpay.js'
  },
  {
    name: 'razor_pay_custom_checkout',
    src: 'https://checkout.razorpay.com/v1/razorpay.js'
  },
  {
    name: 'lightgallery',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/js/lightgallery.min.js'
  },
  {
    name: 'lg-zoom',
    src: '/assets/js/lg-zoom.min.js'
  },
  {
    name: 'lg-hash',
    src: '/assets/js/lg-hash.min.js'
  },
  {
    name: 'lg-thumbnail',
    src: '/assets/js/lg-thumbnail.min.js'
  },
  {
    name: 'card-validator',
    src: '/assets/js/card-validator.js'
  },
  {
    name: 'google_login',
    src: 'https://accounts.google.com/gsi/client'
  },
  {
    name: 'microsoft_clarity',
    src: microsoft_clarity
  },
  {
    name: 'animejs',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js'
  },
  {
    name: 'google_login_button',
    src: 'https://apis.google.com/js/platform.js'
  }
];
@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  private scripts: any = {};

  constructor(
    @Inject(DOCUMENT) private document: any
  ) {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string, params?: any, full_script?: true, domain_name?: string) {
    return new Promise((resolve, reject) => {
      try {
        if (name === 'gtm' && domain_name) {
          // console.log(name)
          const dm: string = Object.keys(environment.gtm_ids).find(item => domain_name.toLocaleLowerCase().match(item)) || '';
          this.scripts[name].src = this.scripts[name]?.src?.replace(`${environment.gtm_id}`, `${environment.gtm_ids[dm] || environment.gtm_id}`);
        }
        // resolve if already loaded
        if (this.scripts[name].loaded) {
          resolve({ script: name, loaded: true, status: 'Already Loaded' });
        } else {
          // load script
          const script: any = this.document.createElement('script');
          script.type = 'text/javascript';
          script.setAttribute('rel', 'preconnect');
          full_script ? script.innerHTML = this.scripts[name].src : script.src = this.scripts[name].src;
          // script.async = true;
          script.defer = true;
          if (params) {
            for (const key in params) {
              if (params.hasOwnProperty(key)) {
                script.setAttribute(key, params[key]);
              }
            }
          }
          if (script.readyState) {  // IE
            script.onreadystatechange = () => {
              if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                this.scripts[name].loaded = true;
                resolve({ script: name, loaded: true, status: 'Loaded' });
              }
            };
          } else {  // Others
            script.onload = () => {
              this.scripts[name].loaded = true;
              resolve({ script: name, loaded: true, status: 'Loaded' });
            };
          }
          script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
          this.document.getElementsByTagName('head')[0].appendChild(script);
        }
      } catch (error) {
        reject(false);
      }
    });
  }
}
