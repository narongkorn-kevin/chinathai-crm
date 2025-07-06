import { Routes } from '@angular/router';
import { AliplayComponent } from './aliplay.component';
import { ViewComponent } from './view/view.component';
import { AliplayService } from './aliplay.service';
import { inject } from '@angular/core';

export default [
    {
        path: '',
        component: AliplayComponent,
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            // transport: () => inject(AliplayService).getTransport(),
            // data: (route) => inject(AliplayService).get(route.params['id']),
        }
    },
] as Routes;
