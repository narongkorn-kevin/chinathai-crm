import { Routes } from '@angular/router';
import { BannerComponent } from './banner.component';

export default [
    {
        path     : '',
        component: BannerComponent,
        resolve  : {
            // categories: () => inject(BannerService).getCategories(),
            // units: () => inject(BannerService).getUnit(),
            // products  : () => inject(InventoryService).getProducts(),
        },
    }
] as Routes;
