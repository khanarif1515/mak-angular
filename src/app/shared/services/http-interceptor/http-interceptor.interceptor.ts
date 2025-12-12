import { HttpHandlerFn, HttpInterceptorFn, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { UtilsService } from '../utils/utils.service';
import { VariablesService } from '../variables/variables.service';
import { inject, makeStateKey, TransferState } from '@angular/core';
import { of, tap } from 'rxjs';
import { REQUEST } from './express.token';

const getRawParams = (params: HttpParams) => {
  const rawParams: Record<string, any> = {};
  for (const key of params.keys()) {
    const val = params.get(key);
    rawParams[key] = val;
  }
  return rawParams;
};

const toHttpParams = (obj: Record<string, string>): HttpParams => {
  let newParams = new HttpParams();
  for (const [key, value] of Object.entries(obj)) {
    newParams = newParams.set(key, value);
  }
  return newParams;
};

const sanitizeParams = (params: HttpParams, util: UtilsService): HttpParams => {
  return toHttpParams(util.sanitizeObject(getRawParams(params)));
};

const injectUtmsToParams = (params: HttpParams, vars: VariablesService): HttpParams => {
  return toHttpParams({ ...getRawParams(params), ...(vars.utms || {}) });
};

export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const util = inject(UtilsService);
  const vars = inject(VariablesService);
  const request = inject(REQUEST, { optional: true });
  const transferState = inject(TransferState);


  let cleanParams = req.params;
  let body: any = req?.body;
  const method = req.method.toUpperCase();

  const flags = {
    skipAuth: false,
    skipUtm: false,
    skipSanitize: false,
    skipError: false
  };

  for (const key in flags) {
    flags[key as keyof typeof flags] = body?.[key] || req.params.get(key) ? true : false;
    cleanParams = cleanParams.delete(key);
    delete body?.[key];
  }

  if (!flags.skipUtm && vars.utms) {
    if (method === 'GET') {
      cleanParams = injectUtmsToParams(cleanParams, vars);
    } else {
      body = { ...vars.utms, ...(body || {}) };
    }
  }

  if (!flags.skipSanitize) {
    cleanParams = sanitizeParams(cleanParams, util);
    body = body ? util.sanitizeObject(body) : body;
  }

  const cloneData: { params?: HttpParams; body?: any; setHeaders?: Record<string, string> } = {
    params: cleanParams,
    body: body
  };

  const token = !flags.skipAuth ? util.getAuthToken() : '';
  if (token) {
    cloneData.setHeaders = { Authorization: `Bearer ${token}` };
  }

  let reqClone = req.clone(cloneData);

  if (!vars.isBrowser) {
    if (request) {
      util.setDomainDetails(request?.get('X-Custom-Header') || '');
    }
    const storedResponse: string = transferState.get(makeStateKey(req.url), null as any);
    if (storedResponse) {
      const response = new HttpResponse({ body: storedResponse, status: 200 });
      return of(response);
    }
  }

  return handleNext(reqClone, next, flags, util);
};

const handleNext = (req: HttpRequest<unknown>, next: HttpHandlerFn, flags: Record<string, any>, util: UtilsService) => {
  return next(req).pipe(tap({
    // next: (res: any) => {
    //   if (!res?.status) return;
    //   console.log(req.url, res);
    // },
    error: (err: any) => {
      if (err?.error?.error === 'token_expired') {
        util.storage.delete('user');
        util.storage.delete('userdata');
        util.storage.deleteFromSession('showBanner');
        // util.vars.isToken = false;
        // util.vars.isPermanentLoggedIn = false;
        // util.vars.isTempLoggedIn = false;
        // util.vars.userData$.next(undefined);
        return;
      }
      if (err?.error?.message && !flags?.['skipError']) {
        // util.openSnackBar(err.error.message, 'error');
      }
    }
  }));
};

