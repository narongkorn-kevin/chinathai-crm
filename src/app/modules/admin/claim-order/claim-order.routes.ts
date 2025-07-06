import { Routes } from '@angular/router';
import { ImportProductOrderComponent } from './claim-order.component';
import { inject } from '@angular/core';
import { ClaimOrderService } from './claim-order.service';
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
