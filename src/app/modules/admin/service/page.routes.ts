import { Routes } from '@angular/router';
import { ServicesComponent } from './services.component';

export default [
    {
        path: '',
        component: ServicesComponent,
        resolve: {
            // branch: () => inject(DeviceService).getBranch(),
        }
    },
] as Routes;
