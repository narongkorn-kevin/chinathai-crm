import { Routes } from '@angular/router';
import { RateComponent } from './rate.component';
import { inject } from '@angular/core';
import { RateService } from './rate.service';

export default [
    {
        path     : '',
        component: RateComponent,
        resolve: {
            type: () => inject(RateService).gettype(),
        }
    },
] as Routes;
