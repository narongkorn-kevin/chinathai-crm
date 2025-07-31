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
            packing_list: () => inject(InvoiceService).getPackingListInthai(),
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            packing_list: () => inject(InvoiceService).getPackingList(),
            data: (route) => inject(InvoiceService).get(route.params['id']),

        }
    },
    {
        path: 'edit/:id',
        component: EditComponent,
        data:{
            type: 'EDIT',
        },
        resolve: {
            packing_list: () => inject(InvoiceService).getPackingList(),
            data: (route) => inject(InvoiceService).get(route.params['id']),
        }
    },

] as Routes;
