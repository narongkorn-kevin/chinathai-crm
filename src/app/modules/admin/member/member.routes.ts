import { Routes } from '@angular/router';
import { MemberComponent } from './member.component';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';
import { MemberService } from './member.service';
import { inject } from '@angular/core';

export default [
    {
        path: '',
        component: MemberComponent,
    },
    {
        path: 'form',
        component: FormComponent,
        data:{
            type: 'NEW',
        },
        resolve: {
            transport: () => inject(MemberService).getTransport(),
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            transport: () => inject(MemberService).getTransport(),
            data: (route) => inject(MemberService).get(route.params['id']),
        }
    },
    {
        path: 'edit/:id',
        component: FormComponent,
        data:{
            type: 'EDIT',
        },
        resolve: {
            transport: () => inject(MemberService).getTransport(),
            data: (route) => inject(MemberService).get(route.params['id']),
        }
    }
] as Routes;
