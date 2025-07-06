import { environment } from '../../../environments/environment';

export interface IHost {
  apiBaseUrl: string;
  favicon: string;
  fullUrl: string;
  logoDarkBg: string;
  logoLightBg: string;
  name: string;
  url: string;
}

const extractHost = (fullUrl: string): string => fullUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

export const Hosts: Record<string, IHost> = {
  default: {
    apiBaseUrl: environment.host.apiBaseUrl,
    favicon: '/favicon.ico',
    fullUrl: environment.host.baseUrl,
    logoDarkBg: '/images/equalall-logo-dark-bg.png',
    logoLightBg: '/images/equalall-logo-light-bg.png',
    name: 'MAK',
    url: extractHost(environment.host.baseUrl),
  },
  'dev.equalall.org': {
    apiBaseUrl: 'https://dev.equalall.org/api/',
    favicon: '/favicon.ico',
    fullUrl: 'https://dev.equalall.org',
    logoDarkBg: '/images/equalall-logo-dark-bg.png',
    logoLightBg: '/images/equalall-logo-light-bg.png',
    name: 'EqualAll',
    url: 'dev.equalall.org'
  },
  'equalall.org': {
    apiBaseUrl: 'https://equalall.org/api/',
    favicon: '/favicon.ico',
    fullUrl: 'https://www.equalall.org',
    logoDarkBg: '/images/equalall-logo-dark-bg.png',
    logoLightBg: '/images/equalall-logo-light-bg.png',
    name: 'EqualAll',
    url: 'equalall.org'
  },
  'ketto.org': {
    apiBaseUrl: 'https://api.ketto.org/api/',
    favicon: '/ketto-favicon.ico',
    fullUrl: 'https://www.ketto.org',
    logoDarkBg: '/images/ketto-logo-dark-bg.svg',
    logoLightBg: '/images/ketto-logo-light-bg.svg',
    name: 'Ketto',
    url: 'ketto.org'
  }

};
