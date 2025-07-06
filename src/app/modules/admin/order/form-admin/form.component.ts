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
import { StatusShipmentComponent } from 'app/modules/shared/status-shipment/status-shipment.component';
import { DynamicDialogComponent } from '../dialog/dynamic-dialog.component';

@Component({
    selector: 'app-form-order-admin',
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
        MatLabel,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatBadgeModule,
        RouterLink,
        SelectImporterComponent,
        SelectMemberComponent,
        UploadFileComponent,
        StatusBadgeComponent,
        StatusShipmentComponent
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe, DecimalPipe],
})
export class FormOrderAdminComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    categoryFee: any[] = [];
    store$: Observable<any>;
    po$: Observable<any>;

    form: FormGroup;
    search: FormControl = new FormControl('', []);
    status: number = 1
    protected _onDestroy = new Subject<void>();

    selectAll: boolean = false;
    orderStatus: string = ''
    purchaseOrder: any[] = [];

    invoiceFiles: any[] = [];
    packingListFiles: any[] = [];
    otherFiles: any[] = [];
    // items = [
    //     { name: 'Apple' },
    //     { name: 'Banana' },
    //     { name: 'Orange' },
    //     { name: 'Grapes' },
    // ];
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
        });
        this.form = this._fb.group({
            items: this._fb.array([]),
            saleOrders: this._fb.array([]),
            trackings: this._fb.array([])
        });
        this.addItem();

    }

    get items(): FormArray {
        return this.form.get('items') as FormArray;
    }

    addItem(): void {
        this.items.push(this._fb.group({
            name: ['กระเป๋า'],
            image: ['https://jptravelstore.com/upload-img/LW/5524/LW5524_60_PK_01.jpg'],
            color: ['-'],
            price_yuan: [100, Validators.required],
            qty: [1, Validators.required],
            total_yuan: [{ value: 100, disabled: true }],
            total_baht: [{ value: 100, disabled: true }],
            service_fee: [100],
            remark: ['']
        }));



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

    removeItem(index: number): void {
        this.items.removeAt(index);
    }

    onQtyOrPriceChange(index: number): void {
        const item = this.items.at(index);
        const qty = item.get('qty')?.value || 0;
        const price = item.get('price_yuan')?.value || 0;
        const total = qty * price;

        item.get('total_yuan')?.setValue(total);
        item.get('total_baht')?.setValue(total); // assume 1:1 for demo
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


    resultData: any;
    openCancelOrderDialog(): void {
        const dialogRef = this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: {
                title: 'ยกเลิกออเดอร์',
                type: 'cancel_order',
                message: '',
                error: 'คุณต้องการยกเลิกสินค้าทั้งหมดใตออร์เดอร์ #AZ9999999 ใช่หรือไม่',
                reason: '' // Initialize empty reason
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.confirmed) {
                this.resultData = {
                    action: 'Order Cancelled',
                    reason: result.data.reason
                };
                console.log('Order cancellation reason:', result.data.reason);
                // Call your API service here
            }
        });
    }

    openCancelProductDialog(): void {
        const dialogRef = this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: {
                title: 'ยกเลิกสินค้าในร้านนี้',
                type: 'cancel_order',
                message: '',
                error: 'คุณต้องการยกเลิกสินค้าทั้งหมดในออเดอร์ #AZ999999999 หรือไม่',
                reason: '' // Initialize empty reason
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.confirmed) {
                this.resultData = {
                    action: 'Order Cancelled',
                    reason: result.data.reason
                };
                console.log('Order cancellation reason:', result.data.reason);
                // Call your API service here
            }
        });
    }

    openCancelAllProductDialog(): void {
        const dialogRef = this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: {
                title: 'ยกเลิกสินค้าทั้งหมดในร้านนี้',
                type: 'cancel_order',
                message: '',
                error: 'คุณต้องการยกเลิกสินค้าทั้งหมดในร้านนี้ใช่หรือไม่',
                reason: '' // Initialize empty reason
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.confirmed) {
                this.resultData = {
                    action: 'Order Cancelled',
                    reason: result.data.reason
                };
                console.log('Order cancellation reason:', result.data.reason);
                // Call your API service here
            }
        });
    }

    // 2. Change PO Dialog Example
    openChangePODialog(): void {
        const dialogRef = this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: {
                title: 'เปลี่ยน PO ผู้รับผิดชอบ',
                type: 'change_po',
                userList: ['คุณ A', 'คุณ B', 'คุณ C'],
                selectedUser: 'คุณ B' // Default selected user
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.confirmed) {
                this.resultData = {
                    action: 'PO Changed',
                    newPO: result.data.selectedUser
                };
                console.log('New responsible PO:', result.data.selectedUser);
                // Call your API service here
            }
        });
    }

    openReturnShopShowDialog(): void {
        const dialogRef = this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: {
                title: 'ตีกลับร้านค้านี้',
                type: 'return_po',
                message: 'ตีกลับร้านค้านี้',
                error: '',
                reason: '' // Initialize empty reason
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.confirmed) {
                this.resultData = {
                    action: 'Order Cancelled',
                    reason: result.data.reason
                };
                console.log('Order cancellation reason:', result.data.reason);
                // Call your API service here
            }
        });
    }

    openReturnProductInShopShowDialog(): void {
        const dialogRef = this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: {
                title: 'ตีกลับสินค้าในร้านนี้',
                type: 'return_po',
                message: 'ตีกลับสินค้าในร้านนี้',
                error: '',
                reason: '' // Initialize empty reason
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.confirmed) {
                this.resultData = {
                    action: 'Order Cancelled',
                    reason: result.data.reason
                };
                console.log('Order cancellation reason:', result.data.reason);
                // Call your API service here
            }
        });
    }

    openReturnOrderShowDialog(): void {
        const dialogRef = this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: {
                title: 'ตีกลับออร์เดอร์',
                type: 'return_order',
                message: 'รอตรวจสอบ',
                error: '',
                reason: '' // Initialize empty reason
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.confirmed) {
                this.resultData = {
                    action: 'Order Cancelled',
                    reason: result.data.reason
                };
                console.log('Order cancellation reason:', result.data.reason);
                // Call your API service here
            }
        });
    }

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






}
