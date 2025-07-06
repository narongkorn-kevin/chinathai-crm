import { Routes } from '@angular/router';
import { DepositPayProductsComponent } from './deposit-pay-products.component';
import { ViewComponent } from './view/view.component';
import { DepositPayProductsService } from './deposit-pay-products.service';
import { inject } from '@angular/core';

export default [
    {
        path: '',
        component: DepositPayProductsComponent,
    },

    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            // transport: () => inject(DepositPayProductsService).getTransport(),
            // data: (route) => inject(DepositPayProductsService).get(route.params['id']),
        }
    },

] as Routes;
