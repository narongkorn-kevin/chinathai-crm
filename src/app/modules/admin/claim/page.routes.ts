import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ClaimComponent } from './claim.component';
import { ClaimFormComponent } from './form/form.component';

export default [
    {
        path: '',
        component: ClaimComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
    {
        path: 'edit/:id',
        component: ClaimFormComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },

] as Routes;
