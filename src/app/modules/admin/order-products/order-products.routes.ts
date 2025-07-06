import { Routes } from '@angular/router';
import { OrderProductsComponent } from './order-products.component';
import { inject } from '@angular/core';
import { OrderProductsService } from './order-products.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderCreateComponent } from './order-create/order-create.component';

export default [
    {
        path     : '',
        component: OrderProductsComponent,
        resolve: {
            member: () => inject(OrderProductsService).getMember$(),
        },
    },
    {
        path     : 'create',
        component: OrderCreateComponent,
        resolve: {

        },
    },
    {
        path     : ':id',
        component: OrderDetailComponent,
        resolve: {

        },
    },
] as Routes;
