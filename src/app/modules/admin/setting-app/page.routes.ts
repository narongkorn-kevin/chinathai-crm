import { Routes } from '@angular/router';
import { SettingAppComponent } from './setting-app.component';
import { inject } from '@angular/core';
import { SettingAppService } from './setting-app.service';

export default [
    {
        path     : '',
        component: SettingAppComponent,
        resolve: {
            data: () => inject(SettingAppService).get(),
        }
    },
] as Routes;
