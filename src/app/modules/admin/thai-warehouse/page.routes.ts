import { Routes } from '@angular/router';
import { WarehouseComponent } from './warehouse.component';
import { WarehouseService } from './warehouse.service';
import { inject } from '@angular/core';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';

export default [
    {
        path     : '',
        component: WarehouseComponent,
        resolve: {
            standard_size: () => inject(WarehouseService).getStandardSize(),
            dashboard_delivery_orders_thai: () => inject(WarehouseService).getDashboardDeliveryOrdersThai(),
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
            product_type: () => inject(WarehouseService).getProductType(),
            product: () => inject(WarehouseService).getProductNoneSack(),

        }
    },
    {
        path: 'edit/:id',
        component: FormComponent,
        data:{
            type: 'EDIT',
        },
        resolve: {
            product_type: () => inject(WarehouseService).getProductType(),
            product: () => inject(WarehouseService).getProductNoneSack(),
            data: (route) => inject(WarehouseService).get(route.params['id']),
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            data: (route) => inject(WarehouseService).getPackingListById(route.params['id']),
        }
    },
] as Routes;
