import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { VariablesService } from '../variables/variables.service';

interface IHeaders { [key: string]: string }
type HttpMethods = 'get' | 'post' | 'put' | 'delete';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly http = inject(HttpClient);
  readonly httpBypass = new HttpClient(inject(HttpBackend));
  private readonly util = inject(UtilsService);
  private readonly vars = inject(VariablesService);

  readonly defaultHeaders: IHeaders = { 'Content-Type': 'application/json' };

  getHeaders(custom?: IHeaders): HttpHeaders {
    return new HttpHeaders({ ...this.defaultHeaders, ...(custom || {}) });
  }

  getUrl(endpoint: string): string {
    return endpoint.startsWith('http') ? endpoint : `${this.vars.hostData.apiUrl}${endpoint}`;
  }

  getParams(endpoint: string, params?: any): HttpParams {
    const finalParams = { ...params, ...this.util.urlToParamObj(endpoint) };
    return finalParams instanceof HttpParams ? finalParams : new HttpParams({ fromObject: finalParams });
  }

  getOptions(params?: any, data?: any, headers?: IHeaders) {
    return {
      headers: this.getHeaders(headers),
      params,
      ...(data ? { body: data } : {})
    };
  }

  request(method: HttpMethods, endpoint: string, params?: any, data?: any, headers?: IHeaders) {
    const url = this.getUrl(endpoint);
    const httpParams = this.getParams(endpoint, params);
    return this.http.request(method, url, this.getOptions(httpParams, data, headers));
  }

  requestBackend(method: HttpMethods, endpoint: string, params?: any, data?: any, headers?: IHeaders) {
    const url = this.getUrl(endpoint);
    const httpParams = this.getParams(endpoint, params);
    return this.httpBypass.request(method, url, this.getOptions(httpParams, data, headers));
  }
}
