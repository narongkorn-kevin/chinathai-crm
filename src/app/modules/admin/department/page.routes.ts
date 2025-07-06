import { Routes } from '@angular/router';
import { DepartmentComponent } from './department.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: DepartmentComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
