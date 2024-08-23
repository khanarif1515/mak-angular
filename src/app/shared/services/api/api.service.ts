import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VariablesService } from '../variables/variables.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private vars: VariablesService
  ) { }

  get(path: string, contentType = 'application/json') {
    if (this.vars.utm_url_string) {
      path = path + `${path.includes('?') ? '&' : '?'}${this.vars.utm_url_string}`;
    }
    const url = environment.API_BASE_URL + path;
    return this.http.get(url, this.setReqOptions({ contentType: contentType }));
  }

  post(path: string, data?: any, contentType = 'application/json') {
    data = { ...data, ...this.vars.utm_url_obj};
    const url = environment.API_BASE_URL + path;
    return this.http.post(url, JSON.stringify(data || {}), this.setReqOptions({ contentType: contentType }));
  }

  put(path: string, data?: any, contentType = 'application/json') {
    data = { ...data, ...this.vars.utm_url_obj};
    const url = environment.API_BASE_URL + path;
    return this.http.put(url, JSON.stringify(data || {}), this.setReqOptions({ contentType: contentType }));
  }

  delete(path: string, contentType = 'application/json') {
    if (this.vars.utm_url_string) {
      path = path + `${path.includes('?') ? '&' : '?'}${this.vars.utm_url_string}`;
    }
    const url = environment.API_BASE_URL + path;
    return this.http.delete(url, this.setReqOptions({ contentType: contentType }));
  }

  setReqOptions(data = { contentType: 'application/json' }) {
    return {
      headers: new HttpHeaders({
        'Content-Type': data?.contentType || 'application/json',
      })
    };
  }

}
