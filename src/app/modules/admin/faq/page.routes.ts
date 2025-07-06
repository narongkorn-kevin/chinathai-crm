import { Routes } from '@angular/router';
import { FaqComponent } from './faq.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: FaqComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
