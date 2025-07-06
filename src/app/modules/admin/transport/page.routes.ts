import { Routes } from '@angular/router';
import { TransportComponent } from './transport.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: TransportComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
