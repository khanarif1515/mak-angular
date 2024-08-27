import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VariablesService } from '../variables/variables.service';

interface IHeaders { [key: string]: string }

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private vars: VariablesService
  ) { }

  get(path: string, headers?: IHeaders) {
    if (this.vars.utm_url_string) {
      path = path + `${path.includes('?') ? '&' : '?'}${this.vars.utm_url_string}`;
    }
    const url = environment.API_BASE_URL + path;
    return this.http.get(url, this.setReqOptions(headers));
  }

  post(path: string, data?: any, headers?: IHeaders) {
    data = { ...data, ...this.vars.utm_url_obj };
    const url = environment.API_BASE_URL + path;
    return this.http.post(url, JSON.stringify(data || {}), this.setReqOptions(headers));
  }

  put(path: string, data?: any, headers?: IHeaders) {
    data = { ...data, ...this.vars.utm_url_obj };
    const url = environment.API_BASE_URL + path;
    return this.http.put(url, JSON.stringify(data || {}), this.setReqOptions(headers));
  }

  delete(path: string, headers?: IHeaders) {
    if (this.vars.utm_url_string) {
      path = path + `${path.includes('?') ? '&' : '?'}${this.vars.utm_url_string}`;
    }
    const url = environment.API_BASE_URL + path;
    return this.http.delete(url, this.setReqOptions(headers));
  }

  setReqOptions(headers: IHeaders = { 'Content-Type': 'application/json' }) {
    return {
      headers: new HttpHeaders(headers)
    };
  }

}
