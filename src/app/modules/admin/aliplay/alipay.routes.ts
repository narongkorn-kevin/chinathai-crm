import { Routes } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { inject } from '@angular/core';
import { AlipayComponent } from './alipay.component';

export default [
    {
        path: '',
        component: AlipayComponent,
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
        }
    },
] as Routes;
