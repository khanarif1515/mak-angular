import { TPageOrigins } from './layout.model';

export interface ITagObj { title: string, description?: string, keywords?: string, url?: string, seoTitle?: string, image?: string, site?: string, robots?: string, twitterTitle?: string };

export const SEODATA: Record<TPageOrigins, ITagObj> = {
  h: {
    title: 'Home | {{HOST_NAME}}',
    description: '{{HOST_NAME}} for managing expense and other records',
    keywords: '{{HOST_NAME}}, management, expense manage',
    image: '/images/home.png'
  },
  abs: {
    title: 'About us | {{HOST_NAME}}',
    description: 'About {{HOST_NAME}}',
    keywords: 'about, {{HOST_NAME}}, about {{HOST_NAME}}',
    image: '/images/aboutus.png'
  },
  prf: {
    title: 'Profile | {{HOST_NAME}}'
  },
  s: {
    title: 'Story | {{HOST_NAME}}'
  },
  veh: {
    title: 'Vehicles | {{HOST_NAME}}'
  },
  veh_br: {
    title: 'Vehicles Brand | {{HOST_NAME}}'
  },
  "404": {
    title: 'Page Not Found'
  },
  '': {
    title: ''
  }
};