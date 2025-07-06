import { Routes } from '@angular/router';
import { SettingCompanyComponent } from './setting-company.component';
import { inject } from '@angular/core';
import { SettingCompanyService } from './setting-company.service';

export default [
    {
        path     : '',
        component: SettingCompanyComponent,
        resolve: {
            data: () => inject(SettingCompanyService).get(),
        }
    },
] as Routes;
