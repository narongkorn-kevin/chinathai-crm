import { Routes } from '@angular/router';
import { PointRecordComponent } from './point-record.component';
import { inject } from '@angular/core';
import { PointRecordService } from './point-record.service';
import { PointRecordDetailComponent } from './detail/point-record-detail.component';

export default [
    {
        path     : '',
        component: PointRecordComponent,
        resolve: {
            member: () => inject(PointRecordService).getMember$(),
        },
    },
    {
        path     : ':code',
        component: PointRecordDetailComponent,
        resolve: {},
    },
] as Routes;
