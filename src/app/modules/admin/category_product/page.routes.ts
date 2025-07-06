import { Routes } from '@angular/router';
import { CategoryProductComponent } from './category-product.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: CategoryProductComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
