import { Routes } from '@angular/router';
import { NewsComponent } from './news.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: NewsComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
