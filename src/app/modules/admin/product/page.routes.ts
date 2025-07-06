import { Routes } from '@angular/router';
import { ProductComponent } from './page.component';
import { inject } from '@angular/core';
import { ProductService } from './product.service';


export default [
  {
    path: '',
    component: ProductComponent,
    resolve: {
      categories: () => inject(ProductService).getCategories(),
      units: () => inject(ProductService).getUnit(),
      branch: () => inject(ProductService).getฺBranch(),
      // products  : () => inject(InventoryService).getProducts(),
    },
  }

] as Routes;
