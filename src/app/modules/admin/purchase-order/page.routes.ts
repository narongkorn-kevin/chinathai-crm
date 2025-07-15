import { Routes } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order.component';
import { inject } from '@angular/core';
import { SoOrderFormComponent } from './form/form.component';

export default [
    {
        path: '',
        component: PurchaseOrderComponent,
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
   
] as Routes;
