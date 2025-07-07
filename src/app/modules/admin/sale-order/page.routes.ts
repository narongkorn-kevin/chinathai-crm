import { Routes } from '@angular/router';
import { SaleOrderComponent } from './sale-order.component';
import { inject } from '@angular/core';
import { SoOrderFormComponent } from './form/form.component';
import { ClaimComponent } from './claim/claim.component';

export default [
    {
        path: '',
        component: SaleOrderComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
    {
        path: 'form',
        component: SoOrderFormComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
    {
        path: 'edit/:id',
        component: SoOrderFormComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
    {
        path: 'claim',
        component: ClaimComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
