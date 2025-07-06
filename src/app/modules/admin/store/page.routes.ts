import { Routes } from '@angular/router';
import { StoreComponent } from './page.component';

export default [
    {
        path     : ':id',
        component: StoreComponent,
    },
] as Routes;
