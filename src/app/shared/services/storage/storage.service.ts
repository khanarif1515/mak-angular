import { inject, Injectable } from '@angular/core';
import { VariablesService } from '../variables/variables.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  private readonly vars = inject(VariablesService);

  private parseJSON(data?: string | null) {
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private safeStringify(value: any): string {
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }

  private isNonEmptyObject(data: any): data is Record<string, any> {
    return data && typeof data === 'object' && Object.keys(data).length > 0;
  }

  add(name: string, data: any): boolean | null {
    if (!this.vars.isBrowser) return null;
    try {
      localStorage.setItem(name, this.safeStringify(data));
      return true;
    } catch {
      return null;
    }
  }

  get(name: string) {
    if (!this.vars.isBrowser) return null;
    const data = this.parseJSON(localStorage.getItem(name));
    return this.isNonEmptyObject(data) ? data : null;
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
    this.delete(name);
    return this.add(name, data);
  }

  getProperty(parent: string, child: string | number) {
    const parentData = this.get(parent);
    // return parentData?.[child] ?? null;
    return parentData ? (parentData[child as keyof typeof parentData]) ?? null : null;
  }

  addSessionData(name: string, data: any) {
    if (!this.vars.isBrowser) return null;
    try {
      sessionStorage.setItem(name, this.safeStringify(data));
      return true;
    } catch {
      return null;
    }
  }

  getFromSession(name: string) {
    if (!this.vars.isBrowser) return null;
    const data = this.parseJSON(sessionStorage.getItem(name));
    return this.isNonEmptyObject(data) ? data : null;
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
    this.deleteFromSession(name);
    return this.addSessionData(name, data);
  }

  getPropertyFromSession(parent: string, child: string | number) {
    const parentData = this.getFromSession(parent);
    // return parentData?.[child] ?? null;
    return parentData ? (parentData[child as keyof typeof parentData]) ?? null : null;
  }

  getCookie(name: string) {
    if (!this.vars.isBrowser) return null;
    const match = this.vars.document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
    // const match = this.vars.document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    // return match ? decodeURIComponent(match[1]) : null;
  }

  getDecodedCookies(name: string) {
    const raw = this.getCookie(name);
    if (!raw) return null;
    try {
      return JSON.parse(atob(decodeURIComponent(raw)));
    } catch {
      return null;
    }
  }

  setCookie(name: string, value: string, days: number, domain?: string) {
    if (!this.vars.isBrowser) return;
    let cookie = `${name}=${encodeURIComponent(value ?? '')}; path=/`;
    if (days) {
      const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
      cookie += `; expires=${expires}`;
    }
    if (domain) {
      cookie += `; domain=${domain}`;
    }
    document.cookie = cookie;
  }

  deleteCookie(name: string, domain?: string) {
    this.setCookie(name, '', -1, domain);
  }
}
