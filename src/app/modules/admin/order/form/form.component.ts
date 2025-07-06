import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
// import { PoService } from './po.service';
import { filter, map, Observable, Subject, switchMap, tap } from 'rxjs';
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
import { OrderService } from '../order.service';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateTime } from 'luxon';
import { DialogAddressComponent } from '../../member/dialog-address/dialog-address.component';
import { DialogAddress } from '../../member/dialog-address/dialog-address';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectImporterComponent } from 'app/modules/common/select-importer/select-importer.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { items } from 'app/mock-api/apps/file-manager/data';
import { StatusBadgeComponent } from 'app/modules/shared/status-badge/status-badge.component';
import { DynamicDialogComponent } from '../dialog/dynamic-dialog.component';

@Component({
    selector: 'app-form-order',
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
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatBadgeModule,
        RouterLink,
        StatusBadgeComponent
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe, DecimalPipe],
})
export class FormOrderComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    categoryFee: any[] = [];
    store$: Observable<any>;
    po$: Observable<any>;

    form: FormGroup;
    search: FormControl = new FormControl('', []);
    status: number = 1
    protected _onDestroy = new Subject<void>();
    currentStatus: string = ''
    selectAll: boolean = false;
    orderStatus: string = ''
    purchaseOrder: any[] = [];

    invoiceFiles: any[] = [];
    packingListFiles: any[] = [];
    otherFiles: any[] = [];
    items = [
        { name: 'Apple' },
        { name: 'Banana' },
        { name: 'Orange' },
        { name: 'Grapes' },
    ];
    constructor(
        private _service: OrderService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private _decimalPipe: DecimalPipe,
        private _fb: FormBuilder,
        private _cdr: ChangeDetectorRef,
    ) {
        this._activateRoute.queryParams.subscribe(params => {
            this.orderStatus = params['status'];
            this.currentStatus = params['status'];
            console.log(this.orderStatus, 'orderStatus');
        });

        this.form = this._fb.group({
            saleOrders: this._fb.array([]),
            trackings: this._fb.array([])
        });

        // เพิ่มข้อมูลเริ่มต้น
        this.addSaleOrder('PH001');
        this.addSaleOrder('PH002');

        this.addTracking({
            saleOrder: 'PH001',
            trackingNo: 'PH001',
            barcode: 'PH001-1',
            ext: '1/1',
            deliveryDate: '-',
            productType: 'C'
        });

        this.addTracking({
            saleOrder: 'PH002',
            trackingNo: 'PH002',
            barcode: 'PH002-1',
            ext: '1/1',
            deliveryDate: '-',
            productType: 'C'
        });

    }

    ngOnInit(): void {
        this.status = 0
        this._cdr.markForCheck()
    }

    ngAfterViewInit() {
    }

    ngOnDestroy(): void {
    }

    statuses = [
        { key: 'all', label: 'ทั้งหมด', count: 0 },
        { key: 'waiting_check', label: 'รอตรวจสอบ', count: 0 },
        { key: 'checking', label: 'กำลังตรวจสอบ', count: 0 },
        { key: 'wait_customer', label: 'รอลูกค้าจ่าย', count: 0 },
        { key: 'wait_payment', label: 'รอจ่ายร้านจีน', count: 0 },
        { key: 'wait_approve', label: 'รอใส่เลขแทรคกิ้งจีน', count: 0 },
        { key: 'approved', label: 'สั่งซื้อสำเร็จ', count: 0 },
        { key: 'canceled', label: 'ยกเลิก', count: 0 },
        { key: 'claim', label: 'เคลมรายการ', count: 0 },
    ];

    selectedTabIndex = 0;




    get saleOrders(): FormArray {
        return this.form.get('saleOrders') as FormArray;
    }

    get trackings(): FormArray {
        return this.form.get('trackings') as FormArray;
    }

    addSaleOrder(orderNo: string = '') {
        this.saleOrders.push(this._fb.group({
            saleOrder: [orderNo]
        }));
    }

    removeSaleOrder(index: number) {
        this.saleOrders.removeAt(index);
    }

    addTracking(data: any) {
        this.trackings.push(this._fb.group({
            saleOrder: [data.saleOrder],
            status: ['รอสินค้าเข้าโกดัง'],
            trackingNo: [data.trackingNo],
            barcode: [data.barcode],
            ext: [data.ext],
            deliveryDate: [data.deliveryDate],
            productType: [data.productType]
        }));
    }

    removeTracking(index: number) {
        this.trackings.removeAt(index);
    }

    openConfirmOrderShowDialog(): void {
        const dialogRef = this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: {
                title: 'ยืนยันการสั่งซื้อ',
                type: 'confirm_order',
                message: 'ยืนยันการสั่งซื้อ',
                error: '',
                reason: '' // Initialize empty reason
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.confirmed) {
                // this.resultData = {
                //     action: 'Order Cancelled',
                //     reason: result.data.reason
                // };
                this.toastr.success('ดำเนินการสำเร็จ');
                console.log('Order cancellation reason:', result.data.reason);
                // Call your API service here
            }
        });
    }

}
