import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';



function bootstrap() {
  bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
  // platformBrowserDynamic().bootstrapModule(AppComponent, appConfig).catch(err => console.log(err));
  // platformBrowserDynamic().bootstrapModule(AppComponent).catch(err => console.log(err));
}

if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}

