import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
// import { PoService } from './po.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { map, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { OrderProductsService } from '../order-products.service';
import { CdkMenuModule } from '@angular/cdk/menu';
import { DialogOrderFeeComponent } from '../../dialog/dialog-order-fee/dialog.component';
import { DialogUpdateStatusComponent } from '../../dialog/dialog-update-status-order/dialog.component';
import { StatusChipComponent } from 'app/modules/common/status-chip/status-chip.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogUpdateDeliveryComponent } from '../../dialog/dialog-update-delivery/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,
        MatTableModule,
        CdkMenuModule,
        StatusChipComponent,
        MatCheckboxModule,
        ReactiveFormsModule,
        FormsModule,
        RouterLink,
    ],
    templateUrl: './order-detail.component.html',
    styleUrl: './order-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe, DecimalPipe],
})
export class OrderDetailComponent implements OnInit, AfterViewInit {

    id: any;

    // dtOptions: any = {};
    // dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

    // @ViewChild('btNg') btNg: any;
    // @ViewChild('textStatus') textStatus: any;

    @ViewChild('pic') pic: any;

    // @ViewChild(DataTableDirective, { static: false })
    // dtElement: DataTableDirective;

    data: any;

    selectAll: boolean = false;

    constructor(
        private _service: OrderProductsService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private _decimalPipe: DecimalPipe,
    ) {
        this.id = this._activateRoute.snapshot.params.id
    }

    ngOnInit(): void {
        // setTimeout(() =>
        //     this.loadTable());
        this._service.get(this.id)
            .pipe(
                map((resp: any) => {
                    resp.data.order_lists.forEach(e => {
                        e.product_total = e.product_qty * e.product_price;

                        e.IsChecked = false;

                        return e
                    })
                    return resp
                }),
            )
            .subscribe({
                next: (resp: any) => {
                    this.data = resp.data;



                    // callback({
                    //     recordsTotal: resp.data.order_lists.length,
                    //     recordsFiltered: resp.data.order_lists.length,
                    //     data: resp.data.order_lists
                    // });
                }
            })
    }

    ngAfterViewInit() {
        // setTimeout(() => {
        //     this.dtTrigger.next(this.dtOptions);
        // }, 200);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        // this.dtTrigger.unsubscribe();
    }

    someSelect(): boolean {
        if (this.data?.order_lists == null) {
            return false;
        }
        return this.data.order_lists.filter(t => t.IsChecked).length > 0 && !this.selectAll;
    }

    clearSelection() {
        this.data.order_lists.forEach(item => {
            item.IsChecked = false;
        });

        this.selectAll = false;
    }

    SelectAll(checked: boolean) {
        this.selectAll = checked; // Set isSelectAll to true when selectAll is checked

        this.data.order_lists.forEach((item) => (item.IsChecked = this.selectAll));
    }

    updateAllselect() {
        this.selectAll = this.data.order_lists != null && this.data.order_lists.every(t => t.IsChecked);
    }

    get seleteListAll() {
        return this.data.order_lists != null && this.data.order_lists.filter(t => t.IsChecked).map(e => e.id);
    }

    backToDelivery() {
        this._router.navigate(['/delivery']);
    }

    goToEdit() {
        this._router.navigate(['/delivery-edit']);
    }

    // rerender(): void {
    //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //         // Destroy the table first
    //         dtInstance.destroy();
    //         // Call the dtTrigger to rerender again
    //         this.dtTrigger.next(this.dtOptions);
    //     });
    // }

    clickEditFee() {
        this.dialog.open(DialogOrderFeeComponent, {
            width: '500px',
            data: {

            }
        })
    }

    clickUpdateStatus() {
        this.dialog.open(DialogUpdateStatusComponent, {
            width: '500px',
            data: {
                orders: [this.data]
            }
        }).afterClosed().subscribe(() => {
            this.ngOnInit();
        })
    }

    clickUpdateTack(data: any) {
        this.dialog.open(DialogUpdateDeliveryComponent, {
            width: '500px',
            data: {
                order_list_id: data.id
            }
        }).afterClosed().subscribe(() => {
            this.ngOnInit();
        })
    }

    clickUpdateOrderListStatus(status: 'waiting_for_review' | 'reviewed' | 'reject') {
        this._service.updateStatusOrderListAll({
            order_lists: this.seleteListAll,
            status: status
        }).subscribe({
            next: (resp: any) => {
                this.selectAll = false;
                this.toastr.success('อัปเดตสถานะสำเร็จ');
                this.ngOnInit();
            },
            error: (error: any) => {
                this.toastr.error('ไม่สามารถอัปเดตสถานะได้');
            }
        });
    }

    ////////////////////////////////////////////////////////////////
}
