import { Routes } from '@angular/router';
import { DeliveryOrdersComponent } from './delivery-orders.component';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';
import { DeliveryOrdersService } from './delivery-orders.service';
import { inject } from '@angular/core';
import { SettingComponent } from './setting/setting.component';
import { StoreService } from '../stores/store.service';

export default [
    {
        path: '',
        component: DeliveryOrdersComponent,
        resolve: {
            tracking: () => inject(DeliveryOrdersService).gettacking(),
            members: () => inject(DeliveryOrdersService).getmember(),
            stores: () => inject(DeliveryOrdersService).getstore(),
            category_products: () => inject(DeliveryOrdersService).getcategory_product(),
            transports: () => inject(DeliveryOrdersService).getTransport(),
            product_types: () => inject(DeliveryOrdersService).getProductType(),
            dashboard_delivery_order: () => inject(DeliveryOrdersService).getDashboardDeliveryOrder(),
        }
    },
    {
        path: 'with-member',
        component: DeliveryOrdersComponent,
        resolve: {
            tracking: () => inject(DeliveryOrdersService).gettacking(),
            members: () => inject(DeliveryOrdersService).getmember(),
            stores: () => inject(DeliveryOrdersService).getstore(),
            category_products: () => inject(DeliveryOrdersService).getcategory_product(),
            transports: () => inject(DeliveryOrdersService).getTransport(),
            product_types: () => inject(DeliveryOrdersService).getProductType(),
            dashboard_delivery_order: () => inject(DeliveryOrdersService).getDashboardDeliveryOrder(),
        }
    },
    {
        path: 'non-member',
        component: DeliveryOrdersComponent,
        data: {
            type: 'non-member'
        },
        resolve: {
            tracking: () => inject(DeliveryOrdersService).gettacking(),
            members: () => inject(DeliveryOrdersService).getmember(),
            stores: () => inject(DeliveryOrdersService).getstore(),
            category_products: () => inject(DeliveryOrdersService).getcategory_product(),
            transports: () => inject(DeliveryOrdersService).getTransport(),
            product_types: () => inject(DeliveryOrdersService).getProductType(),
            dashboard_delivery_order: () => inject(DeliveryOrdersService).getDashboardDeliveryOrder(),
        }
    },
    {
        path: 'form',
        component: FormComponent,
        data: {
            type: 'NEW',
        },
        resolve: {
            store: () => inject(StoreService).getall(),
            product_type: () => inject(DeliveryOrdersService).getProductType(),
            standard_size: () => inject(DeliveryOrdersService).getStandardSize(),
            product_draft: () => inject(DeliveryOrdersService).getProductDraft(),
            on_services: () => inject(DeliveryOrdersService).getAddOnServices(),
            unit: () => inject(DeliveryOrdersService).getUnit(),
            order: () => inject(DeliveryOrdersService).getOrder(),
            tracking: () => inject(DeliveryOrdersService).gettacking(),
            packing_type: () => inject(DeliveryOrdersService).getpacking_type(),
            delivery_orders: () => inject(DeliveryOrdersService).getDeliveryOrders(),
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            product_type: () => inject(DeliveryOrdersService).getProductType(),
            members: () => inject(DeliveryOrdersService).getmember(),
            standard_size: () => inject(DeliveryOrdersService).getStandardSize(),
            data: (route) => inject(DeliveryOrdersService).get(route.params['id']),
        }
    },
    {
        path: 'edit/:id',
        component: FormComponent,
        data: {
            type: 'EDIT',
        },
        resolve: {
            transport: () => inject(DeliveryOrdersService).getTransport(),
            order: () => inject(DeliveryOrdersService).getOrder(),
            tracking: () => inject(DeliveryOrdersService).gettacking(),
            store: () => inject(StoreService).getall(),
            product_type: () => inject(DeliveryOrdersService).getProductType(),
            standard_size: () => inject(DeliveryOrdersService).getStandardSize(),
            product_draft: () => inject(DeliveryOrdersService).getProductDraft(),
            on_services: () => inject(DeliveryOrdersService).getAddOnServices(),
            unit: () => inject(DeliveryOrdersService).getUnit(),
            packing_type: () => inject(DeliveryOrdersService).getpacking_type(),
            data: (route) => inject(DeliveryOrdersService).get(route.params['id']),
        }
    },
    {
        path: 'setting',
        component: SettingComponent,
        data: {
            // type: 'EDIT',
        },
        resolve: {
            // transport: () => inject(DeliveryOrdersService).getTransport(),
            // data: (route) => inject(DeliveryOrdersService).get(route.params['id']),
        },
        // children: [
        //     {
        //         path: 'form',
        //         component: FormSettingComponent,
        //     }
        // ]
    }
] as Routes;
