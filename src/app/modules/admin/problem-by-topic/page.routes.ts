import { Routes } from '@angular/router';
import { ProblemTopicComponent } from './problem-topic.component';
import { inject } from '@angular/core';
import { ProblemTopicService } from './problem-topic.service';

export default [
    {
        path     : '',
        component: ProblemTopicComponent,
        resolve: {
            topic: () => inject(ProblemTopicService).gettopic(),
        }
    },
] as Routes;
