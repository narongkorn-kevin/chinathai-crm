import { Routes } from '@angular/router';
import { SackComponent } from './sack.component';
import { SackService } from './sack.service';
import { inject } from '@angular/core';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';

export default [
    {
        path     : '',
        component: SackComponent,
        resolve: {
            standard_size: () => inject(SackService).getStandardSize(),
            // tracking: () => inject(DeliveryOrdersService).gettacking(),
        },
    },
    {
        path: 'form',
        component: FormComponent,
        data:{
            type: 'NEW',
        },
        resolve: {
            product_type: () => inject(SackService).getProductType(),
            product: () => inject(SackService).getProductNoneSack(),

        }
    },
    {
        path: 'edit/:id',
        component: FormComponent,
        data:{
            type: 'EDIT',
        },
        resolve: {
            product_type: () => inject(SackService).getProductType(),
            product: () => inject(SackService).getProductNoneSack(),
            data: (route) => inject(SackService).get(route.params['id']),
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            data: (route) => inject(SackService).get(route.params['id']),
        }
    },
] as Routes;
