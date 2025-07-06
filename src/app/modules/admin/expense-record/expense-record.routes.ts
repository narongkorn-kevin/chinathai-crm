import { Routes } from '@angular/router';
import { ExpenseRecordComponent } from './expense-record.component';
import { inject } from '@angular/core';
import { ExpenseRecordService } from './expense-record.service';
import { ExpenseRecordDetailComponent } from './detail/expense-record-detail.component';

export default [
    {
        path     : '',
        component: ExpenseRecordComponent,
        resolve: {
            member: () => inject(ExpenseRecordService).getMember$(),
        },
    },
    {
        path     : ':code',
        component: ExpenseRecordDetailComponent,
        resolve: {},
    },
] as Routes;
