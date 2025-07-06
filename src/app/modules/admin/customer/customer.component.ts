import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TrackingNumberTableComponent } from './tracking-number-table/tracking-number-table.component';
import { OrderTableComponent } from './order-table/order-table.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { InvNumberTableComponent } from './inv-number-table/inv-number-table.component';

@Component({
  selector: 'asha-customer',
  standalone: true,
  imports: [
    MatTabsModule,
    TrackingNumberTableComponent,
    OrderTableComponent,
    CustomerTableComponent,
    InvNumberTableComponent
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit {
  selectedTabIndex = 0;

  @ViewChild(TrackingNumberTableComponent) trackingTable!: TrackingNumberTableComponent;
  @ViewChild(OrderTableComponent) orderTable!: OrderTableComponent;
  @ViewChild(CustomerTableComponent) customerTable!: CustomerTableComponent;
  @ViewChild(InvNumberTableComponent) InvTable!: InvNumberTableComponent;

  constructor() { }

  ngOnInit(): void {

  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
    if (event.index === 0) {
      this.trackingTable?.rerender();
    }
    if (event.index === 1) {
      this.orderTable?.rerender();
    }
    if (event.index === 2) {
      this.customerTable?.rerender();
    }
    if (event.index === 3) {
      this.InvTable?.rerender();
    }
  }

}
