import { Routes } from '@angular/router';
import { HomeBannerComponent } from './advert.component';
import { AdvertService } from './advert.service';
import { inject } from '@angular/core';

export default [
    {
        path: '',
        component: HomeBannerComponent,
        resolve: {
            get_ads: () => inject(AdvertService).getAds(),
        },
    },
] as Routes;
