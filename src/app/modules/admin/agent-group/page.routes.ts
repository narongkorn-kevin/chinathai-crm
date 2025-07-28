import { Routes } from '@angular/router';
import { AgentGroupComponent } from './agent-group.component';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';
import { AgentGroupService } from './agent-group.service';
import { inject } from '@angular/core';

export default [
    {
        path: '',
        component: AgentGroupComponent,
    },
    {
        path: 'form',
        component: FormComponent,
        data:{
            type: 'NEW',
        },
        resolve: {
            transport: () => inject(AgentGroupService).getTransport(),
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            transport: () => inject(AgentGroupService).getTransport(),
            data: (route) => inject(AgentGroupService).get(route.params['id']),
        }
    },
    {
        path: 'edit/:id',
        component: FormComponent,
        data:{
            type: 'EDIT',
        },
        resolve: {
            transport: () => inject(AgentGroupService).getTransport(),
            data: (route) => inject(AgentGroupService).get(route.params['id']),
        }
    }
] as Routes;
