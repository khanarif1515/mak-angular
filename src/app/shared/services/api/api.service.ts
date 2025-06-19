import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { VarService } from '../var/var.service';
import { UtilService } from '../util/util.service';

interface IHeaders { [key: string]: string }

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly vars = inject(VarService);
  readonly util = inject(UtilService);
  readonly http = inject(HttpClient);
  readonly httpBypass = new HttpClient(inject(HttpBackend));
  readonly defaultHeaders: IHeaders = { 'Content-Type': 'application/json' };

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
