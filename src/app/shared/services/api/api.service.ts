import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VariablesService } from '../variables/variables.service';
import { API_URLS } from 'src/environments/api-urls';
import { UtilService } from '../util/util.service';
import { ICLientData } from '../../model/client.model';
import { DefaultIPLocation } from '../../model/default-ip';
import { ActivatedRoute } from '@angular/router';

interface IHeaders { [key: string]: string }

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private actRoute: ActivatedRoute,
    private http: HttpClient,
    private util: UtilService,
    private vars: VariablesService
  ) { }

  get(path: string, qParams?: any, headers?: IHeaders) {
    const { url, options } = this.handleReq(path, headers);
    return this.http.get(url, { ...options, params: qParams });
  }

  post(path: string, data?: any, headers?: IHeaders) {
    const { url, options, body } = this.handleReq(path, headers, data);
    return this.http.post(url, JSON.stringify(body || {}), options);
  }

  put(path: string, data?: any, headers?: IHeaders) {
    const { url, options, body } = this.handleReq(path, headers, data);
    return this.http.put(url, JSON.stringify(body || {}), options);
  }

  delete(path: string, headers?: IHeaders) {
    const { url, options } = this.handleReq(path, headers);
    return this.http.delete(url, options);
  }

  setReqOptions(headers: IHeaders = { 'Content-Type': 'application/json' }) {
    if (this.vars.authToken) {
      headers = {
        ...headers,
        Authorization: `Bearer ${this.vars.authToken}`
      }
    }
    return {
      headers: new HttpHeaders(headers)
    };
  }

  handleReq(path: string, headers?: IHeaders, data?: any): { url: string, body?: any, options?: any } {
    const options = this.setReqOptions(headers);
    let body = data;
    if (body && this.vars.utm_url_obj) {
      body = { ...body, ...this.vars.utm_url_obj };
    } else if (this.vars.utm_url_string) {
      path += `${path.includes('?') ? '&' : '?'}${this.vars.utm_url_string}`;
    }
    const url = `${!path.startsWith('http') ? (this.vars.domain_details?.apiUrl || environment.API_BASE_URL) : ''}${path}`;
    return { url, body, options };
  }

  fileUpload(path: string, data?: any, headers?: IHeaders) {
    const { url } = this.handleReq(path, headers);
    const fd = new FormData();
    fd.append('file', data);
    const options = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.vars.authToken}`
      }),
    };
    return this.http.post(url, fd, options);
  }

  getShortURL(payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.post<{ data: { data: { short_url: string } } }>((this.vars.domain_details?.apiUrl || environment.API_BASE_URL) + API_URLS.GET_SHORT_URL, payload, this.setReqOptions()).subscribe({
        next: (res: any) => {
          resolve(res.data.data.short_url);
        }, error: (error) => {
          reject(false);
        }
      });
    });
  }

  getClientIp() {
    return new Promise(async (resolve, reject) => {
      const ip = this.util.storage.getFromSession('iplocation');
      if (ip) {
        await this.setClientIP(ip);
      } else {
        await this.setClientIP();
      }
      resolve(true);
    });
  }

  setClientIP(ip: ICLientData = DefaultIPLocation) {
    return new Promise((resolve, reject) => {
      this.vars.clientLocationData$.next(ip);
      this.util.storage.checkFromSession('iplocation', ip);
      const currencyFromUrl = this.actRoute.snapshot.queryParams['selected_currency'];
      const currencyFromCode = this.util.getCurrencyFromCode(ip.country_code);
      const currencyFromSession = this.util.storage.getFromSession('currency');
      if (currencyFromUrl) {
        this.util.setCurrency(currencyFromUrl);
      } else if (currencyFromSession) {
        this.util.setCurrency(currencyFromSession);
      } else if (currencyFromCode) {
        this.util.setCurrency(currencyFromCode?.currency || '');
      }
      resolve(true);
    });
  }
}
