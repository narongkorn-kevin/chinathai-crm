import { Routes } from '@angular/router';
import { ShippingRatesComponent } from './shipping-rates.component';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';
import { ShippingRatesService } from './shipping-rates.service';
import { inject } from '@angular/core';

export default [
    {
        path: '',
        component: ShippingRatesComponent,
    },
    {
        path: 'form',
        component: FormComponent,
        data: {
            type: 'NEW',
        },
        resolve: {
            transport: () => inject(ShippingRatesService).getTransportType(),
            productType: () => inject(ShippingRatesService).getProductType(),
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            transport: () => inject(ShippingRatesService).getTransportType(),
            productType: () => inject(ShippingRatesService).getProductType(),
            itemData: (route) => inject(ShippingRatesService).getById(route.params['id']),
            // data: (route) => inject(ShippingRatesService).get(route.params['id']),
        }
    },
    {
        path: 'edit/:id',
        component: FormComponent,
        data: {
            type: 'EDIT',
        },
        resolve: {
            transport: () => inject(ShippingRatesService).getTransportType(),
            productType: () => inject(ShippingRatesService).getProductType(),
            itemData: (route) => inject(ShippingRatesService).getById(route.params['id']),
        }
    }
] as Routes;
