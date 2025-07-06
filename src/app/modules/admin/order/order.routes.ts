import { Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { FormOrderComponent } from './form/form.component';
import { FormOrderAdminComponent } from './form-admin/form.component';

export default [
    {
        path: 'approve',
        component: OrderComponent,
        data: {
            type: 'approve',
            title: 'รายการฝากสั่งสินค้า'
        }
    },
    {
        path: 'admin',
        component: OrderComponent,
        data: {
            type: 'admin',
            title: 'รายการฝากสั่งสินค้าที่รับผิดชอบ'
        }
    },
    {
        path: '',
        component: OrderComponent,
    },
    {
        path: 'view/approve/:id',
        component: FormOrderComponent,
        data: 'approve'
    },
    {
        path: 'view/admin/:id',
        component: FormOrderAdminComponent,
        data: 'admin'
    },
] as Routes;
