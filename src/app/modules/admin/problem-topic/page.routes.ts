import { Routes } from '@angular/router';
import { ProblemTopicComponent } from './problem-topic.component';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: ProblemTopicComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
