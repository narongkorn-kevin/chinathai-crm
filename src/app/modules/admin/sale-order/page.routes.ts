import { Routes } from '@angular/router';
import { SaleOrderComponent } from './sale-order.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: SaleOrderComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
