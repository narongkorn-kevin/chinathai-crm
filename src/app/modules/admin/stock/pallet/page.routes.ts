import { Routes } from '@angular/router';
import { PalletComponent } from './page.component';
import { PalletService } from './pallet.service';
import { inject } from '@angular/core';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';


export default [
    {
        path     : '',
        component: PalletComponent,
        resolve: {
            standard_size: () => inject(PalletService).getStandardSize(),
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
            transports: () => inject(PalletService).getTransport(),
            product_type: () => inject(PalletService).getProductType(),
            product: () => inject(PalletService).getProductNonePallet(),
        }
    },
    {
        path: 'edit/:id',
        component: FormComponent,
        data:{
            type: 'EDIT',
        },
        resolve: {
            product_type: () => inject(PalletService).getProductType(),
            product: () => inject(PalletService).getProductNonePallet(),
            data: (route) => inject(PalletService).get(route.params['id']),
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            data: (route) => inject(PalletService).get(route.params['id']),
        }
    },
] as Routes;
