import { Routes } from '@angular/router';
import { FollowUpComponent } from './follow-up.component';
import { inject } from '@angular/core';
import { FollowUpService } from './follow-up.service';
import { ImportOrderCreateComponent } from './import-order-create/import-order-create.component';
import { ImportOrderDetailComponent } from './import-order-detail/import-order-detail.component';

export default [
    {
        path     : '',
        component: FollowUpComponent,
        resolve: {

        },
    },
    {
        path     : 'create',
        component: ImportOrderCreateComponent,
        resolve: {

        },
    },
    {
        path     : ':id',
        component: ImportOrderDetailComponent,
        resolve: {

        },
    },
] as Routes;
