import { Routes } from '@angular/router';
import { DeviceComponent } from './page.component';
import { DeviceService } from './page.service';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: DeviceComponent,
        resolve: {
            branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
