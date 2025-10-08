import { Routes } from '@angular/router';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderCreateComponent } from './order-create/order-create.component';

export default [
    {
        path     : '',
        component: OrderHistoryComponent,
    },
    {
        path     : 'create',
        component: OrderCreateComponent,
        resolve: {

        },
    },
    {
        path     : ':id',
        component: OrderDetailComponent,
        resolve: {

        },
    },
] as Routes;
