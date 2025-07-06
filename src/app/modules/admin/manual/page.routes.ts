import { Routes } from '@angular/router';
import { ManualComponent } from './page.component';
import { inject } from '@angular/core';
import { FormComponent } from './form/form.component';
import { CategoryManualService } from '../category-manual/page.service';

export default [
    {
        path     : '',
        component: ManualComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
    {
        path     : 'form',
        component: FormComponent,
        resolve: {
            categoryManual: () => inject(CategoryManualService).get(),
        }
    },
    {
        path     : 'edit/:id',
        component: FormComponent,
        resolve: {
            categoryManual: () => inject(CategoryManualService).get(),
        }
    },
   
] as Routes;
