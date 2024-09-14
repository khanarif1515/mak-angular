import { environment } from "src/environments/environment";

export interface IDomain {
  favicon: string;
  fullUrl: string;
  apiUrl: string;
  logoDarkBg: string;
  logoLightBg: string;
  name: string;
  url: string;
}

export const Domains: { [key: string]: IDomain } = {
  'default': { url: environment.DOMAIN_URL.split('://')[1], fullUrl: environment.DOMAIN_URL, apiUrl: environment.API_BASE_URL, name: 'MAK', logoLightBg: 'assets/images/mak-logo-light-bg.png', logoDarkBg: 'assets/images/mak-logo-dark-bg.png', favicon: 'assets/mak-favicon.ico' },
  'dev.equalall.org': { url: 'dev.equalall.org', fullUrl: 'https://dev.equalall.org', apiUrl: 'https://dev.equalall.org/api/', name: 'EqualAll', logoLightBg: 'assets/images/equalall-logo-light-bg.png', logoDarkBg: 'assets/images/equalall-logo-dark-bg.png', favicon: 'assets/favicon.ico' },
  'equalall.org': { url: 'equalall.org', fullUrl: 'https://www.equalall.org', apiUrl: 'https://equalall.org/api/', name: 'EqualAll', logoLightBg: 'assets/images/equalall-logo-light-bg.svg', logoDarkBg: 'assets/images/equalall-logo-dark-bg.svg', favicon: 'assets/favicon.ico' },
  'ketto.org': { url: 'ketto.org', fullUrl: 'https://www.ketto.org', apiUrl: 'https://api.ketto.org/api/', name: 'Ketto', logoLightBg: 'assets/images/ketto-logo-light-bg.svg', logoDarkBg: 'assets/images/ketto-logo-dark-bg.svg', favicon: 'assets/ketto-favicon.ico' }
};