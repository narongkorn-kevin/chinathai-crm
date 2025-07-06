import { Routes } from '@angular/router';
import { FeeComponent } from './page.component';
import { CategoryFeeService } from '../category-fee/page.service';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: FeeComponent,
        resolve: {
            categoryfee: () => inject(CategoryFeeService).get(),
      
        },
    },
] as Routes;
