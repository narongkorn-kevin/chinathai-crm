import { Routes } from '@angular/router';
import { PositionComponent } from './position.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: PositionComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
