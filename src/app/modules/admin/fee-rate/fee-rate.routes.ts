import { Routes } from '@angular/router';
import { FeeRateService } from './fee-rate.service';
import { inject } from '@angular/core';
import { FormComponent } from './form.component';

export default [
    {
        path: '',
        component: FormComponent,
        resolve: {
                    fee_rate: () => inject(FeeRateService).getFeeRate(),
                }
    },

] as Routes;
