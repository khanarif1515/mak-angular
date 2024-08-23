import { Injectable } from '@angular/core';
import { VariablesService } from '../variables/variables.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private vars: VariablesService
  ) { }

  add(name: string, data: any) {
    if (this.vars.isBrowser) {
      try {
        localStorage.setItem(name, JSON.stringify(data));
        return true;
      } catch (e) {
        console.log(e);
      }
    }
    return null;
  }

  check(name: string, data: any) {
    if (this.get(name)) {
      this.delete(name);
      this.add(name, data);
    } else {
      this.add(name, data);
    }
  }

  get(name: string) {
    if (this.vars.isBrowser) {
      try {
        const data = JSON.parse(localStorage.getItem(name) || '{}');
        if (Object.keys(data).length !== 0) {
          return data;
        }
      } catch (e) {
        console.log(e);
      }
    }
    return null;
  }

  delete(name: string) {
    if (this.vars.isBrowser) {
      try {
        localStorage.removeItem(name);
        return true;
      } catch (e) {
        console.log(e);
      }
    }
    return null;
  }

  getProperty(parent: string, child: string | number) {
    if (this.vars.isBrowser) {
      try {
        const data = JSON.parse(localStorage.getItem(parent) || '{}');
        if (Object.keys(data).length !== 0) {
          return data[child] || null;
        }
      } catch (e) {
        console.log(e);
      }
    }
    return null;
  }

  getFromSession(name: string) {
    if (this.vars.isBrowser) {
      try {
        const data = JSON.parse(sessionStorage.getItem(name) || '{}');
        if (Object.keys(data).length !== 0) {
          return data;
        }
      } catch (e) {
        console.log(e);
      }
    }
    return null;
  }

  deleteFromSession(name: string) {
    if (this.vars.isBrowser) {
      try {
        sessionStorage.removeItem(name);
        return true;
      } catch (e) {
        console.log(e);
      }
    }
    return null;
  }

  checkFromSession(name: string, data: any) {
    if (this.getFromSession(name)) {
      this.deleteFromSession(name);
      this.addSessionData(name, data);
    } else {
      this.addSessionData(name, data);
    }
  }

  addSessionData(name: string, data: any) {
    if (this.vars.isBrowser) {
      try {
        sessionStorage.setItem(name, JSON.stringify(data));
        return true;
      } catch (e) {
        console.log(e);
      }
    }
    return null;
  }

  getPropertyFromSession(parent: string, child: string | number) {
    if (this.vars.isBrowser) {
      try {
        const data = JSON.parse(sessionStorage.getItem(parent) || '{}');
        if (Object.keys(data).length !== 0) {
          return data[child] || false;
        }
      } catch (e) {
        console.log(e);
      }
    }
    return null;
  }

  getCookie(name: string) {
    if (this.vars.isBrowser) {
      const value = '; ' + document.cookie;
      const parts = value.split('; ' + name + '=');
      if (parts.length === 2) {
        return parts?.pop()?.split(';').shift();
      }
    }
    return null;
  }

  getDecodedCookies(name: string) {
    if (this.vars.isBrowser) {
      const value = '; ' + document.cookie;
      const parts = value.split('; ' + name + '=');
      if (parts.length === 2) {
        return JSON.parse(atob(decodeURIComponent(parts?.pop()?.split(';')?.shift() || '')));
      }
    }
    return null;
  }

  setCookie(cname: string, cvalue: string, exdays: number, domain?: string): void {
    if (this.vars.isBrowser) {
      let expires = '';
      if (exdays) {
        const date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
      }
      const domainString = domain ? `; domain=${domain}` : '';
      document.cookie = `${cname}=${cvalue || ''}${expires}; path=/${domainString}`;
    }
  }

  deleteCookie(name: string, domain?: string): void {
    if (this.vars.isBrowser) {
      document.cookie = name + `=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/; domain=${domain || ''}`;
    }
  }
}
