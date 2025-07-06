import { Routes } from '@angular/router';
import { StoreComponent } from './store.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: StoreComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
