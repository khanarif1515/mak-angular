import { Inject, Injectable } from '@angular/core';
import { clevertap_script, gtm_script, microsoft_clarity } from './external_js';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  scripts: any = {
    'googlemaps': {
      src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDCF-b1N89za5IiNd95L27vx-XyFzUeoCE&callback&libraries=places',
      loaded: false
    },
    'facebooksdk': {
      src: 'https://connect.facebook.net/en_US/all.js',
      loaded: false
    },
    'intl_tel_input': {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/14.0.7/js/intlTelInput.min.js',
      loaded: false
    },
    'intl_tel_input_util': {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/14.0.7/js/utils.js',
      loaded: false
    },
    'stripe': {
      src: 'https://js.stripe.com/v2/',
      loaded: false
    },
    'jquery': {
      src: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
      loaded: false
    },
    'pusher': {
      src: `https://cdnjs.cloudflare.com/ajax/libs/pusher/4.3.1/pusher.min.js`,
      loaded: false
    },
    'twitter': {
      src: `https://platform.twitter.com/widgets.js`,
      loaded: false
    },
    'gtm': {
      src: gtm_script,
      loaded: false
    },
    'clevertap': {
      src: clevertap_script,
      loaded: false
    },
    'razor_pay': {
      src: 'https://checkout.razorpay.com/v1/checkout.js',
      loaded: false
    },
    'razor_pay_custom_checkout': {
      src: 'https://checkout.razorpay.com/v1/razorpay.js',
      loaded: false
    },
    'lightgallery': {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/js/lightgallery.min.js',
      loaded: false
    },
    'lg-zoom': {
      src: 'assets/js/lg-zoom.min.js',
      loaded: false
    },
    'lg-hash': {
      src: 'assets/js/lg-hash.min.js',
      loaded: false
    },
    'lg-thumbnail': {
      src: 'assets/js/lg-thumbnail.min.js',
      loaded: false
    },
    'card-validator': {
      src: 'assets/js/card-validator.js',
      loaded: false
    },
    'google_login': {
      src: 'https://accounts.google.com/gsi/client',
      loaded: false
    },
    'microsoft_clarity': {
      src: microsoft_clarity,
      loaded: false
    },
    'google_login_button': {
      src: 'https://apis.google.com/js/platform.js',
      loaded: false
    }
  };

  constructor(
    @Inject(DOCUMENT) private document: any
  ) { }

  loadScript(name: string, params?: any, full_script?: true, domain_name?: string) {
    return new Promise((resolve, reject) => {
      try {
        if (name === 'gtm' && domain_name) {
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
