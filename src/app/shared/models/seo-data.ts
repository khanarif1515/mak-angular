import { IPageOrigins } from './layout-config.model';
export interface ISeoMeta {
  title: string;
  desc: string;
  keywords: string;
  image?: string;
  ogTitle?: string;
  ogDesc?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDesc?: string;
  twitterImage?: string;
  robots?: string;
  site?: string;
  pageUrl?: string;
}

export const SeoPageData: Record<IPageOrigins, ISeoMeta> = {
  '': {
    title: '',
    desc: '',
    keywords: '',
    image: ''
  },
  'h': {
    title: 'MAK',
    desc: 'MAK',
    keywords: 'MAK'
  },
  's': {
    title: '',
    desc: '',
    keywords: ''
  },
  'si': {
    title: 'MAK - Signin',
    desc: 'MAK - Signin',
    keywords: 'MAK Signin'
  },
  'su': {
    title: 'MAK - Register',
    desc: 'MAK - Register',
    keywords: 'MAK Register'
  },
  'haz': {
    title: 'Honda Amaze - MH-12-PQ-4787',
    desc: 'Honda Amaze - MH-12-PQ-4787',
    keywords: 'Honda Amaze - MH-12-PQ-4787'
  },
  '404': {
    title: '404 Page Not Found',
    desc: '404 Page Not Found',
    keywords: '404'
  },
};