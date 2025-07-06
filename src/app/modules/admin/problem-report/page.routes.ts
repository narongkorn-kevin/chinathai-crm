import { Routes } from '@angular/router';
import { ProblemTopicComponent } from './problem-topic.component';
import { inject } from '@angular/core';
import { ProblemDetailComponent } from './problem-detail/problem-detail.component';

export default [
    {
        path     : '',
        component: ProblemTopicComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
    {
        path     : ':id',
        component: ProblemDetailComponent,
        resolve: {

        },
    },
] as Routes;
