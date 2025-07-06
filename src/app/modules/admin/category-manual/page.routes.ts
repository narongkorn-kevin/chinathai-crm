import { Routes } from '@angular/router';
import { CategoryManualComponent } from './page.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: CategoryManualComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
