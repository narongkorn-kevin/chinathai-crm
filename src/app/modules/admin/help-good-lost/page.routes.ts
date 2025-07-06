import { Routes } from '@angular/router';
import { HelpGoodLostComponent } from './help-good-lost.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: HelpGoodLostComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
