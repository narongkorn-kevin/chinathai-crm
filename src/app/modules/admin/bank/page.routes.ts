import { Routes } from '@angular/router';
import { BankComponent } from './bank.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: BankComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
