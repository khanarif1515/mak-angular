import { environment } from '../../../environments/environment';

export interface IDomain {
  apiUrl: string;
  favicon: string;
  fullUrl: string;
  name: string;
  primaryLogo: string;
  secondaryLogo: string;
  url: string;
}

export const ALL_DOMAINS: { [key: string]: IDomain } = {
  'default': { url: environment.baseUrl.split('://')[1], fullUrl: environment.baseUrl, apiUrl: environment.apiBaseUrl, favicon: 'assets/favicon/favicon.ico', name: 'Angular 21', primaryLogo: '', secondaryLogo: '' }
};