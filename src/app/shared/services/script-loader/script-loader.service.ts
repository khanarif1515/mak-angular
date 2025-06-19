import { inject, Injectable } from '@angular/core';
import { VarService } from '../var/var.service';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  private readonly vars = inject(VarService);

  scripts = {
    pusher: 'https://cdnjs.cloudflare.com/ajax/libs/pusher/4.3.1/pusher.min.js',
    stripe: 'https://js.stripe.com/v3/',
    jQuery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js'
  } as const;

  private loadedScripts: (keyof typeof this.scripts)[] = [];

  load(scriptKey: keyof typeof this.scripts, attributes?: Record<string, string>): Promise<boolean> {
    const scriptSrc = this.scripts[scriptKey];
    if (this.loadedScripts.includes(scriptKey) || this.vars.document.querySelector(`script[src="${scriptSrc}"]`)) {
      return Promise.resolve(true);
    }

    return new Promise<boolean>((resolve, reject) => {
      const scriptEl = this.vars.document.createElement('script');
      scriptEl.src = scriptSrc;
      scriptEl.async = true;
      scriptEl.defer = true;

      // Add optional attributes
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          scriptEl.setAttribute(key, value);
        });
      }

      scriptEl.onload = () => {
        this.loadedScripts.push(scriptKey);
        resolve(true)
      };
      scriptEl.onerror = () => reject(false);

      this.vars.document.head.appendChild(scriptEl);
    });
  }

}
