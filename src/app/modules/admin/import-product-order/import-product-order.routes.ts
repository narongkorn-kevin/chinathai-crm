import { Routes } from '@angular/router';
import { ImportProductOrderComponent } from './import-product-order.component';
import { inject } from '@angular/core';
import { ImportProductOrderService } from './import-product-order.service';
import { ImportOrderCreateComponent } from './import-order-create/import-order-create.component';
import { ImportOrderDetailComponent } from './import-order-detail/import-order-detail.component';

export default [
    {
        path     : '',
        component: ImportProductOrderComponent,
        resolve: {

        },
    },
    {
        path     : 'create',
        component: ImportOrderCreateComponent,
        resolve: {

        },
    },
    {
        path     : ':id',
        component: ImportOrderDetailComponent,
        resolve: {

        },
    },
] as Routes;
