import { Routes } from '@angular/router';
import { BannersComponent } from './banners.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: BannersComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
