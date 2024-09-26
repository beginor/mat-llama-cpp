import {
    ApplicationConfig, provideZoneChangeDetection, LOCALE_ID,
 } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { provideNzI18n, zh_CN } from 'ng-zorro-antd/i18n';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withHashLocation()),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        {
            provide: LOCALE_ID,
            useValue: 'zh-Hans'
        },
        provideNzI18n(zh_CN),
        {
            provide: NzModalService,
            useClass: NzModalService,
        },
        {
            provide: NzMessageService,
            useClass: NzMessageService,
        }
    ]
};
