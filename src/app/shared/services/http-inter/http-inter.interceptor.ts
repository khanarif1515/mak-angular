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
      // services.vars.domain_details = {
      //   domain_name: `${serverReq.get('X-Custom-Header')}`,
      //   domain_url: `${this.getProtocol(serverReq)}://${serverReq.get('X-Custom-Header')}`,
      //   full_url: `${this.getProtocol(serverReq)}://${serverReq.get('X-Custom-Header')}${serverReq.url}`
      // };
      // if (services.vars.domain_details.domain_name) {
      //   services.util.setDomainDetails();
      // }
      // const storedResponse: string = this._transferState.get(makeStateKey(req.url), null as any);
      // if (storedResponse) {
      //   const response = new HttpResponse({ body: storedResponse, status: 200 });
      //   return of(response);
      // }
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





// import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
// import { inject, InjectionToken, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
// import { UtilService } from '../util/util.service';
// import { VariablesService } from '../variables/variables.service';
// import { isPlatformServer } from '@angular/common';
// import { IncomingMessage } from 'http';
// import { Request } from 'express';
// import { catchError, Observable, of, throwError } from 'rxjs';

// export declare const REQUEST: InjectionToken<Request>;

// export const httpInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
//   const platformId = inject(PLATFORM_ID);
//   const transferState = inject(TransferState);
//   const services = {
//     util: inject(UtilService),
//     vars: inject(VariablesService)
//   };

//   // const token = services.storage.getToken();
//   // const isToken = services.util.isToken;

//   let authReq: HttpRequest<any>;
//   // if (isToken && !req.params.get('filter')) {
//   //   authReq = req.clone({
//   //     headers: req.headers.set('Authorization', 'Bearer ' + token)
//   //   });
//   // } else {
//   //   authReq = req.clone({});
//   // }

//   if (isPlatformServer(platformId)) {
//     const serverReq = inject<IncomingMessage>(REQUEST); // Inject IncomingMessage for request access
//     console.log(serverReq.headers);

//     services.vars.domain_details = {
//       domain_name: `${serverReq.headers['x-custom-header']}`,
//       domain_url: `${getProtocol(serverReq)}://${serverReq.headers['x-custom-header']}`,
//       full_url: `${getProtocol(serverReq)}://${serverReq.headers['x-custom-header']}${serverReq.url}`
//     };
//     console.log(services.vars.domain_details);

//     if (services.vars.domain_details.domain_name) {
//       services.util.setDomainDetails();
//     }

//     const storedResponse: string = transferState.get(makeStateKey(req.url), null as any);
//     if (storedResponse) {
//       const response = new HttpResponse({ body: storedResponse, status: 200 });
//       return of(response);
//     }
//   }

//   return nextHandler(req, next);
// };

// const nextHandler = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//   return next(req).pipe(
//     catchError((error) => {
//       const services = {
//         util: inject(UtilService),
//         vars: inject(VariablesService)
//       };
//       let postBody: any;
//       try {
//         postBody = JSON.parse(req.body);
//       } catch (error) { }

//       const param = req.params.get('showError') || postBody?.showError;
//       if (error && error.error && error.error.message && param !== 'false' && error.error.error !== 'token_expired') {
//         // services.util.openSnackBar(error.error.message, 'error');
//       }
//       if (error && error.error && error.error.error === 'token_expired') {
//         services.util.storage.delete('user');
//         services.util.storage.delete('userdata');
//         // services.vars.isToken = false;
//         services.vars.isPermanentLoggedIn$.next(false);
//         services.vars.isTempLoggedIn$.next(false);
//         services.vars.userData$.next(undefined);
//       }
//       return throwError(() => error);
//     })
//   );
// };

// const getProtocol = (req: IncomingMessage): string => {
//   const expressReq = req as Request;
//   const proto = (expressReq.headers['x-forwarded-proto'] as string) || 'http';
//   return proto.split(/\s*,\s*/)[0];
// };
