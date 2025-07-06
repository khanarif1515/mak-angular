import { inject, Injectable } from '@angular/core';
import { VarS } from '../var/var';

@Injectable({
  providedIn: 'root'
})
export class StorageS {
  readonly vars = inject(VarS);

  private parseJSON(data: string | null) {
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  add(name: string, data: any) {
    if (!this.vars.isBrowser) return null;
    try {
      localStorage.setItem(name, JSON.stringify(data));
      return true;
    } catch {
      return null;
    }
  }

  get(name: string) {
    if (!this.vars.isBrowser) return null;
    const data = this.parseJSON(localStorage.getItem(name));
    return data && Object.keys(data).length ? data : null;
  }

  delete(name: string) {
    if (!this.vars.isBrowser) return null;
    try {
      localStorage.removeItem(name);
      return true;
    } catch {
      return null;
    }
  }

  check(name: string, data: any) {
    if (this.get(name)) {
      this.delete(name);
    }
    return this.add(name, data);
  }

  getProperty(parent: string, child: string | number) {
    const parentData = this.get(parent);
    return parentData ? parentData[child] ?? null : null;
  }

  addSessionData(name: string, data: any) {
    if (!this.vars.isBrowser) return null;
    try {
      sessionStorage.setItem(name, JSON.stringify(data));
      return true;
    } catch {
      return null;
    }
  }

  getFromSession(name: string) {
    if (!this.vars.isBrowser) return null;
    const data = this.parseJSON(sessionStorage.getItem(name));
    return data && Object.keys(data).length ? data : null;
  }

  deleteFromSession(name: string) {
    if (!this.vars.isBrowser) return null;
    try {
      sessionStorage.removeItem(name);
      return true;
    } catch {
      return null;
    }
  }

  checkFromSession(name: string, data: any) {
    if (this.getFromSession(name)) {
      this.deleteFromSession(name);
    }
    return this.addSessionData(name, data);
  }

  getPropertyFromSession(parent: string, child: string | number) {
    const parentData = this.getFromSession(parent);
    return parentData ? parentData[child] ?? null : null;
  }

  getCookie(name: string) {
    if (!this.vars.isBrowser) return null;
    const match = this.vars.document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  getDecodedCookies(name: string) {
    const cookieValue = this.getCookie(name);
    if (!cookieValue) return null;
    try {
      return JSON.parse(atob(decodeURIComponent(cookieValue)));
    } catch {
      return null;
    }
  }

  setCookie(name: string, value: string, exdays: number, domain?: string) {
    if (!this.vars.isBrowser) return;
    let expires = '';
    if (exdays) {
      const date = new Date();
      date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    const domainStr = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=${encodeURIComponent(value || '')}${expires}; path=/${domainStr}`;
  }

  deleteCookie(name: string, domain?: string) {
    this.setCookie(name, '', -1, domain);
  }

}
