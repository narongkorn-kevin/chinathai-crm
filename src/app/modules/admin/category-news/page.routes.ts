import { Routes } from '@angular/router';
import { CategoryNewsComponent } from './category-news.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: CategoryNewsComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
