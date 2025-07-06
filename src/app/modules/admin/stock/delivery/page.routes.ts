import { Routes } from '@angular/router';
import { DeliveryComponent } from './delivery.component';
import { DeliveryService } from './delivery.service';
import { inject } from '@angular/core';
import { SettingComponent } from './setting/setting.component';
import { FormComponent } from './form/form.component';

export default [
    {
        path     : '',
        component: DeliveryComponent,
        resolve: {

        },
    },
    {
        path: 'edit/:id',
        component: FormComponent,
        data:{
            type: 'EDIT',
        },
        resolve: {
            product_type: () => inject(DeliveryService).getProductType(),
            data: (route) => inject(DeliveryService).getshipment(route.params['id']),
        }
    },
    {
        path: 'settings',
        component: SettingComponent,
        resolve: {
            // data: (route) => inject(DeliveryService).get(route.params['id']),
            OrderShipment: () => inject(DeliveryService).getShipment(),
        }
    },

] as Routes;
