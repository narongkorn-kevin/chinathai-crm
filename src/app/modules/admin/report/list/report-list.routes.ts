import { Routes } from '@angular/router';
import { ReportListComponent } from './report-list.component';
import { ReportListService } from './report-list.service';
import { inject } from '@angular/core';

export default [
    {
        path     : '',
        component: ReportListComponent,
        resolve: {
            branch: () => inject(ReportListService).getBranch(),
        }
    },
] as Routes;
