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
  'default': { url: environment.DOMAIN_URL.split('://')[1], fullUrl: environment.DOMAIN_URL, apiUrl: environment.API_BASE_URL, name: 'MAK', logoLightBg: 'assets/images/mak-logo.png', logoDarkBg: 'assets/images/mak-logo.png', favicon: 'assets/mak-favicon.ico' }
};