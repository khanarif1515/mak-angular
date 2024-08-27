import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Inject, Injectable, InjectionToken, Injector, makeStateKey, PLATFORM_ID, TransferState } from "@angular/core";
import { catchError, Observable, of, throwError } from "rxjs";
import { UtilService } from "../util/util.service";
import { VariablesService } from "../variables/variables.service";
import { isPlatformServer } from "@angular/common";
import { Request } from "express";

export declare const REQUEST: InjectionToken<Request>;

@Injectable({
  providedIn: 'root'
})
export class HttpInterService implements HttpInterceptor {
  constructor(
    public injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object,
    public _transferState: TransferState,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const services = {
      util: this.injector.get(UtilService),
      vars: this.injector.get(VariablesService)
    };
    const user = services.util.storage.get('user');
    const token = user?.token || '';
    const isToken = services.vars.isToken;
    let authReq: HttpRequest<any>;
    if (isToken && !req.params.get('filter')) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
    } else {
      authReq = req.clone({});
    }

    if (isPlatformServer(this.platformId)) {
      // const serverReq = this.injector.get(REQUEST);
      // services.util.setDomainDetails(serverReq.get('X-Custom-Header') || '');
      const storedResponse: string = this._transferState.get(makeStateKey(req.url), null as any);
      if (storedResponse) {
        const response = new HttpResponse({ body: storedResponse, status: 200 });
        return of(response);
      }
    }
    return this.nextHandler(authReq, next);
  }

  nextHandler(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        const services = {
          util: this.injector.get(UtilService),
          vars: this.injector.get(VariablesService)
        };
        let postBody: any;
        try {
          postBody = JSON.parse(req.body)
        } catch (error) { }
        const param = req.params.get('showError') || postBody?.showError;
        if (error && error.error && error.error.message && param !== 'false' && error.error.error !== 'token_expired') {
          services.util.openSnackBar(error.error.message, 'error');
        }
        if (error && error.error && error.error.error === 'token_expired') {
          console.log(error.error.error);
          services.util.storage.delete('user');
          services.util.storage.delete('userdata');
          services.util.storage.deleteFromSession('showBanner');
          services.vars.isToken = false;
          services.vars.isPermanentLoggedIn$.next(false);
          services.vars.isTempLoggedIn$.next(false);
          services.vars.userData$.next(undefined);
        }
        return throwError(() => error);
      }) as any
    );
  }

  getProtocol(req: any) {
    console.log(req);
    let proto = req?.connection?.encrypted ? 'https' : 'http';
    proto = req?.headers['x-forwarded-proto'] || proto;
    return proto?.split(/\s*,\s*/)[0];
  }
}
