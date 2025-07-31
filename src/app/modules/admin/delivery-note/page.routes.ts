import { Routes } from '@angular/router';
import { DeliveryNoteComponent } from './delivery-note.component';
import { DeliveryNoteService } from './delivery-note.service';
import { inject } from '@angular/core';
import { ViewComponent } from './view/view.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { FormComponent } from './form/form.component';
import { ViewOrderAfterComponent } from './view-order-after/view-order-after.component';

export default [
    {
        path     : '',
        component: DeliveryNoteComponent,
        resolve: {
            transports: (route) => inject(DeliveryNoteService).getTransport(),
        },
    },
    {
        path: 'view-order',
        component: ViewOrderComponent,
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            data: (route) => inject(DeliveryNoteService).get(route.params['id']),
        }
    },
    {
        path: 'view-order/:id',
        component: ViewOrderComponent,
        resolve: {
            data: (route) => inject(DeliveryNoteService).getDeliveryInThaiControlById(route.params['id']),
        }
    },
    {
        path: 'view-order/edit/:id',
        component: ViewOrderComponent,
        data: {
            type: 'edit',
        },
        resolve: {
            data: (route) => inject(DeliveryNoteService).getDeliveryInThaiControlById(route.params['id']),
        }
    },
    {
        path: 'view-order-after/:id',
        component: ViewOrderAfterComponent,
        resolve: {
            data: (route) => inject(DeliveryNoteService).get(route.params['id']),
        }
    },
    {
        path: 'edit/:id',
        component: FormComponent,
        data:{
            type: 'EDIT',
        },
        resolve: {
            transports: (route) => inject(DeliveryNoteService).getTransport(),
            data: (route) => inject(DeliveryNoteService).get(route.params['id']),
        }
    },

] as Routes;
