import { Routes } from '@angular/router';
import { SackComponent } from './lot.component';
import { LotService } from './lot.service';
import { inject } from '@angular/core';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';
import { ScanComponent } from './scan_to_pallet/scan.component';
import { ViewDraftComponent } from './view_draft/view-draft.component';

export default [
    {
        path     : '',
        component: SackComponent,
        resolve: {
            standard_size: () => inject(LotService).getStandardSize(),
            packing_list: () => inject(LotService).getPackingList(),
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
            product_type: () => inject(LotService).getProductType(),
            product: () => inject(LotService).getProductNoneSack(),

        }
    },
    {
        path: 'edit/:id',
        component: FormComponent,
        data:{
            type: 'EDIT',
        },
        resolve: {
            product_type: () => inject(LotService).getProductType(),
            product: () => inject(LotService).getProductNoneSack(),
            data: (route) => inject(LotService).get(route.params['id']),
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            data: (route) => inject(LotService).get(route.params['id']),
        }
    },
    {
        path: 'draft/:id',
        component: ViewDraftComponent,
        resolve: {
            data: (route) => inject(LotService).get(route.params['id']),
        }
    },
    {
        path: 'scan-po/:id',
        component: ScanComponent,
        resolve: {
            data: (route) => inject(LotService).get(route.params['id']),
        }
    },

] as Routes;
