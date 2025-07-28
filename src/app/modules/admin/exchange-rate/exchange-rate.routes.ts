import { Routes } from '@angular/router';
import { ExchangeRateService } from './exchange-rate.service';
import { inject } from '@angular/core';
import { FormComponent } from './form.component';

export default [
    {
        path: '',
        component: FormComponent,
        resolve: {
            exchange_rete: () => inject(ExchangeRateService).getExchangeRate(),
        }
    },

] as Routes;
