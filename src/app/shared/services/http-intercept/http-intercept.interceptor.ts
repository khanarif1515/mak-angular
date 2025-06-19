import { HttpHandlerFn, HttpInterceptorFn, HttpParams, HttpRequest } from '@angular/common/http';
import { inject, REQUEST } from '@angular/core';
import { VarService } from '../var/var.service';
import { UtilService } from '../util/util.service';
import { Hosts } from '../../models/host.model';
import { tap } from 'rxjs/operators';

const getRawParams = (params: HttpParams) => {
  const rawParams: Record<string, any> = {};
  for (const key of params.keys()) {
    const val = params.get(key);
    rawParams[key] = val;
  }
  return rawParams;
}

const toHttpParams = (obj: Record<string, string>): HttpParams => {
  let newParams = new HttpParams();
  for (const [key, value] of Object.entries(obj)) {
    newParams = newParams.set(key, value);
  }
  return newParams;
}

const sanitizeParams = (params: HttpParams, util: UtilService) => {
  return toHttpParams(util.sanitizeObject(getRawParams(params)));
}

const injectUtmsToParams = (params: HttpParams, vars: VarService) => {
  return toHttpParams({ ...getRawParams(params), ...vars.utms });
}

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const vars = inject(VarService);
  const util = inject(UtilService);
  const request = inject(REQUEST, { optional: true });

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

  const cloneData: any = {
    params: cleanParams,
    body: body
  };

  const token = !flags.skipAuth ? util.getAuthToken() : '';
  if (token) {
    cloneData.setHeaders = { Authorization: `Bearer ${token}` };
  }

  let reqClone = req.clone(cloneData);

  if (!vars.isBrowser && request) {
    const url = new URL(request.url);
    if (Hosts?.[url.hostname]) {
      vars.hostData = Hosts[url.hostname];
    }
    if (!req.url.startsWith('http')) {
      reqClone = reqClone.clone({ url: url.href });
    }
  }

  return handleNext(reqClone, next, flags, util);
};

const handleNext = (req: HttpRequest<unknown>, next: HttpHandlerFn, flags: Record<string, any>, util: UtilService) => {
  return next(req).pipe(tap({
    // next: (res: any) => {
    //   if (!res?.status) return;
    //   console.log(req.url, res);
    // },
    error: (err: any) => {
      if (!err?.status || flags?.['skipError']) return;
      console.log(err?.message);
    }
  }));
}
