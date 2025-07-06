import { Routes } from '@angular/router';
import { ReportComponent } from './summry-report/report.component';
import { ReportPaymentTypeComponent } from './payment-type/report.component';
import { ReportSalerComponent } from './saler/report.component';
import { ReportProductTypeComponent }  from './product-type/report.component';
import { CompactComponent } from './compact.component';
import { CashierComponent } from './cashier/cashier.component';
import { BillReportComponent } from './bill-report/bill-report.component';
import { CardReportComponent } from './card/card-report.component';
import { ReportProductComponent } from './product/report.component';
import { ReportListComponent } from './list/report-list.component';

export default [
    {
        path     : 'total',
        component: ReportComponent,
    },
    {
        path     : 'payment-type',
        component: ReportPaymentTypeComponent,
    },
    {
      path     : 'product-type',
      component: ReportProductTypeComponent,
    },
    {
    path     : 'product',
    component: ReportProductComponent,
    },
    {
        path     : 'saler',
        component: ReportSalerComponent,
    },
    {
        path     : 'print/:id',
        component: CompactComponent,
    },
    {
        path     : 'cashier',
        component: CashierComponent,
    },
    {
        path: 'bills',
        component: BillReportComponent,
    },
    {
        path: 'card',
        component: CardReportComponent,
    },
    {
        path: 'list',
        component: ReportListComponent,
    },
] as Routes;
