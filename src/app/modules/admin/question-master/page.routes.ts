import { Routes } from '@angular/router';
import { QuestionMasterComponent } from './question-master.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: QuestionMasterComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
