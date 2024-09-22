import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { VariableService } from '../variable/variable.service';

interface IHeaders { [key: string]: string }

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private vars: VariableService
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

  fileUpload(path: string, data?: any, headers?: IHeaders) {
    const fd = new FormData();
    fd.append('file', data);
    // const { url, options } = this.handleReq(path, headers);
    return this.post(path, fd);
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

}
