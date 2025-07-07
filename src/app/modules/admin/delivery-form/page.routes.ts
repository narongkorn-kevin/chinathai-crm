import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ShippingFormComponent } from './form.component';

export default [
    {
        path: '',
        component: ShippingFormComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
  

] as Routes;
