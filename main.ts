import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './src/app/app.module';
import { environment } from './src/environments/environment';

if (environment.production) {
  enableProdMode();
}

const launch = () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
}

if (window.hasOwnProperty('Office') && window.hasOwnProperty('Word')) {
  Office.initialize = reason => {
    console.log("reason", reason);
    launch();
  }
} else { // <-- for running in browser
  launch();
}
