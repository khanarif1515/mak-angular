import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { VarS } from '../var/var';
import { UtilS } from '../util/util';
import { environment } from '../../../../environments/environment';

interface IHeaders { [key: string]: string }

@Injectable({
  providedIn: 'root'
})
export class ApiS {

  readonly defaultHeaders: IHeaders = { 'Content-Type': 'application/json' };
  readonly http = inject(HttpClient);
  readonly httpBypass = new HttpClient(inject(HttpBackend));
  readonly util = inject(UtilS);
  readonly vars = inject(VarS);

  constructor() { }

  getHeaders(customHeaders?: IHeaders): HttpHeaders {
    return new HttpHeaders({ ...this.defaultHeaders, ...customHeaders });
  }

  getUrl(endpoint: string): string {
    return endpoint.startsWith('http') ? endpoint : `${this.vars.hostData.apiBaseUrl}${endpoint}`;
  }

  getOptions(endpoint: string, params?: any, data?: any, headers?: IHeaders) {
    params = { ...params, ...this.util.urlToParamObj(endpoint) };
    return {
      headers: this.getHeaders(headers),
      params: params instanceof HttpParams ? params : new HttpParams({ fromObject: params || {} }),
      ...(data ? { body: data } : {})
      // ...(data ? { body: JSON.stringify(data) } : {})
    };
  }

  request(method: 'get' | 'post' | 'put' | 'delete', endpoint: string, params?: any, data?: any, headers?: IHeaders) {
    return this.http.request(method, this.getUrl(endpoint), this.getOptions(endpoint, params, data, headers));
  }

  requestBackend(method: 'get' | 'post' | 'put' | 'delete', endpoint: string, params?: any, data?: any, headers?: IHeaders) {
    return this.httpBypass.request(method, this.getUrl(endpoint), this.getOptions(endpoint, params, data, headers));
  }
}
