import { Routes } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { InvoiceService } from './invoice.service';
import { inject } from '@angular/core';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';

export default [
    {
        path     : '',
        component: InvoiceComponent,
        resolve: {
            transports: (route) => inject(InvoiceService).getTransport(),
        },
    },
    {
        path: 'form',
        component: FormComponent,
        data:{
            type: 'NEW',
        },
        resolve: {
            // transport: () => inject(InvoiceService).getTransport(),
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            // data: (route) => inject(DeliveryNoteService).get(route.params['id']),
        }
    },
    // {
    //     path: 'view-order/:id',
    //     component: ViewOrderComponent,
    //     resolve: {
    //         // data: (route) => inject(DeliveryNoteService).get(route.params['id']),
    //     }
    // },
    // {
    //     path: 'view-order-after/:id',
    //     component: ViewOrderAfterComponent,
    //     resolve: {
    //         // data: (route) => inject(DeliveryNoteService).get(route.params['id']),
    //     }
    // },
    {
        path: 'edit/:id',
        component: EditComponent,
        data:{
            type: 'EDIT',
        },
        resolve: {
            // transports: (route) => inject(InvoiceService).getTransport(),
            // data: (route) => inject(DeliveryNoteService).get(route.params['id']),
        }
    },

] as Routes;
