export interface IDomain {
  favicon: string;
  fullUrl: string;
  logoDarkBg: string;
  logoLightBg: string;
  name: string;
  url: string;
}

export const Domains: { [key: string]: IDomain } = {
  'default': { url: 'mak-ui.vercel.app',  fullUrl: 'https://mak-ui.vercel.app', name: 'Equal All', logoLightBg: 'assets/images/mak-logo-light-bg.svg', logoDarkBg: 'assets/images/mak-logo-dark-bg.svg', favicon: 'assets/mak-favicon.ico' },
  'dev.equalall.org': { url: 'dev.equalall.org',  fullUrl: 'https://dev.equalall.org', name: 'Equal All', logoLightBg: 'assets/images/equalall-logo-light-bg.svg', logoDarkBg: 'assets/images/equalall-logo-dark-bg.svg', favicon: 'assets/favicon.ico' },
  'equalall.org': { url: 'equalall.org',  fullUrl: 'https://www.equalall.org', name: 'Equal All', logoLightBg: 'assets/images/equalall-logo-light-bg.svg', logoDarkBg: 'assets/images/equalall-logo-dark-bg.svg', favicon: 'assets/favicon.ico' },
  'ketto.org': { url: 'ketto.org',  fullUrl: 'https://www.ketto.org', name: 'Ketto', logoLightBg: 'assets/images/ketto-logo-light-bg.svg', logoDarkBg: 'assets/images/ketto-logo-dark-bg.svg', favicon: 'assets/ketto-favicon.ico' }
};