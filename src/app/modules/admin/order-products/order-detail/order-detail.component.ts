import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
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
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PictureComponent } from 'app/modules/shared/picture/picture.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TranslateTextPipe } from 'app/modules/shared/translate.pipe';
import { TranslationService } from 'app/modules/shared/translate.service';
import { MatChipsModule } from '@angular/material/chips';
import { getPermissionName } from 'app/helper';

const ORDER_STATUS = [
    {
        id: 1,
        value: 'awaiting_summary',
        name: 'awaiting_summary'
    },
    {
        id: 2,
        value: 'awaiting_payment',
        name: 'awaiting_payment',
    },
    {
        id: 3,
        value: 'in_progress',
        name: 'in_progress',
    },
    {
        id: 4,
        value: 'preparing_shipment',
        name: 'preparing_shipment',
    },
    {
        id: 5,
        value: 'shipped',
        name: 'shipped'
    },
    {
        id: 6,
        value: 'cancelled',
        name: 'cancelled'
    },
];

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [
        TranslocoModule,
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
        MatInputModule,
        MatFormFieldModule,
        NgxMaskDirective,
        TranslateTextPipe,
        MatChipsModule
    ],
    templateUrl: './order-detail.component.html',
    styleUrl: './order-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe, DecimalPipe, provideNgxMask()],
})
export class OrderDetailComponent implements OnInit, AfterViewInit {
    id: any;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    confirmOrder: FormGroup;
    @ViewChild('pic') pic: any;
    data: any;
    selectAll: boolean = false;
    permissionName = null;
    summary = {
        rate: 0,
        totalQty: 0,
        totalPriceYuan: 0,
        serviceFeeBaht: 0,
        chinaShippingBaht: 0,
        otherFeeYuan: 0,
        totalPriceBaht: 0,
        totalFinalBaht: 0,
        depositFee: 0
    };

    constructor(
        private translocoService: TranslocoService,
        private _service: OrderProductsService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private _decimalPipe: DecimalPipe,
        private _fb: FormBuilder,
        private translationService: TranslationService
    ) {
        this.permissionName = getPermissionName();

        this.id = this._activateRoute.snapshot.params.id;
        this.confirmOrder = this._fb.group({
            deposit_fee: [0],
            exchange_rate: [0],
            china_shipping_fee: [0],

            order_lists: this._fb.array([])
        });
    }

    ngOnInit(): void {

        this._service
            .get(this.id)
            .pipe(
                map((resp: any) => {
                    let totalQty = 0;
                    let totalPrice = 0;
                    let totalYen = 0
                    resp.data.order_lists.forEach((e) => {
                        if (resp.data.exchange_rate != null) {
                            e.product_total = e.product_qty * e.product_price * resp.data.exchange_rate;
                            e.rate = resp.data.exchange_rate;
                        } else {
                            e.product_total = e.product_qty * e.product_price * e.rate;
                        }
                        const qty = parseFloat(e.product_qty);
                        const price = parseFloat(e.product_price);
                        const rate = resp.data.exchange_rate ?? e.rate;

                        // สะสม qty
                        totalQty += isNaN(qty) ? 0 : qty;

                        // คำนวณยอดรวม
                        e.product_total = qty * price * rate;
                        totalPrice += isNaN(qty * price * rate) ? 0 : qty * price * rate;
                        totalYen += isNaN(qty * price) ? 0 : qty * price;
                        e.IsChecked = false;

                        return e;
                    });
                    return resp;
                }),
                map((resp: any) => {
                    const grouped = resp.data.order_lists.reduce((acc, curr) => {
                        acc[curr.product_shop] ??= [];
                        acc[curr.product_shop].push(curr);
                        return acc;
                    }, {} as Record<string, any[]>);

                    // แปลงให้อยู่ในรูปแบบ array [{ showName, orderList }]
                    resp.data.order_lists_group = Object.entries(grouped).map(([shop, list]) => ({
                        showName: shop,
                        orderList: list
                    }));

                    return resp;
                })
            )
            .subscribe({
                next: (resp: any) => {
                    this.data = resp.data;

                    this.confirmOrder.patchValue({
                        ...this.data
                    })
                    this.calculateSummary();
                    console.log(resp);

                },


            });
    }

    // ใน component.ts
    getSelectedCount(): number {
        return this.data?.order_lists_group?.reduce((count, shop) =>
            count + shop.orderList.filter(item => item.IsChecked).length, 0) || 0;
    }

    get totalPrice() {
        return this.data?.total_price;
    }

    get orderLists(): FormArray {
        return this.confirmOrder.get('order_lists') as FormArray;
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
        return (
            this.data.order_lists.filter((t) => t.IsChecked).length > 0 &&
            !this.selectAll
        );
    }

    get hasAnySelected(): boolean {
        return this.data?.order_lists?.some(t => t.IsChecked) ?? false;
    }

    clearSelection() {
        this.data.order_lists.forEach((item) => {
            item.IsChecked = false;
        });
        this.selectAll = false;
    }

    get disableButton() {
        if (!this.data) {
            return true;
        }
        return ['in_progress', 'preparing_shipment', 'shipped', 'cancelled'].includes(this.data?.status)
    }

    SelectAll(checked: boolean) {
        this.selectAll = checked; // Set isSelectAll to true when selectAll is checked

        this.data.order_lists.forEach(
            (item) => (item.IsChecked = this.selectAll)
        );
        // ถ้า checked == true ให้ push ทั้งหมดเข้า orderLists
        if (checked) {
            this.orderLists.clear(); // เคลียร์ก่อนกันซ้ำ
            this.data.order_lists.forEach((item) => {
                const value = this._fb.group({
                    order_list_id: [item.id],
                    product_real_price: [item.product_real_price],
                    product_real_link: [item.product_real_link],
                    product_negotiated_price: [item.product_negotiated_price],
                    qty: [item.product_qty],
                    product_shop: [item.product_shop],
                });
                this.orderLists.push(value);

            });
        } else {
            // ถ้า unchecked ให้ล้าง orderLists ทั้งหมด
            this.orderLists.clear();
        }
    }

    updateAllselect(item: any) {
        const index = this.orderLists.controls.findIndex(
            (ctrl) => ctrl.value.order_list_id === item.id
        );

        if (index === -1) {
            // ถ้ายังไม่มีให้เพิ่มใหม่
            const value = this._fb.group({
                order_list_id: [item.id],
                product_real_price: [item.product_real_price],
                product_real_link: [item.product_real_link],
                product_negotiated_price: [item.product_negotiated_price],
                qty: [item.product_qty],
                product_shop: [item.product_shop],
            });
            this.orderLists.push(value);
        } else {
            // ถ้ามีแล้วให้ลบออก
            this.orderLists.removeAt(index);
        }
        // อัปเดตสถานะ selectAll
        this.selectAll =
            this.data.order_lists != null &&
            this.data.order_lists.every((t) => t.IsChecked);
    }

    get seleteListAll() {
        return (
            this.data.order_lists != null &&
            this.data.order_lists.filter((t) => t.IsChecked).map((e) => e.id)
        );
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
        if (this.orderLists.length < 1) {
            this.toastr.info(this.translocoService.translate('order_products.order_detail.select_order_list'));
            return;
        }
        this.dialog.open(DialogOrderFeeComponent, {
            width: '500px',
            data: {
                orderLists: this.confirmOrder.value,
                orderId: this.data.id
            },
        })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.ngOnInit();
                    this.selectAll = false;
                    this.orderLists.clear();
                }
            });
    }

    clickUpdateStatus() {
        // ตรวจสอบสถานะใน Item ย่อยหากมี waiting_for_review จะไม่ให้แก้ไข
        if (this.data.order_lists.some((e) => e.status == 'waiting_for_review')) {
            this.toastr.info(this.translocoService.translate('order_products.order_detail.invalid_status'));
            return;
        }


        if (this.permissionName == 'admin') {
            this.dialog
                .open(DialogUpdateStatusComponent, {
                    width: '500px',
                    data: {
                        orders: [this.data],
                        status: ORDER_STATUS,

                    },
                })
                .afterClosed()
                .subscribe(() => {
                    this.ngOnInit();
                });
        } else if (this.permissionName == 'operator') {
            // ให้ operator แก้ไขได้แค่ preparing_shipment ถึง shipped อย่างเดียว
            const currStatus = ORDER_STATUS.find((e) => e.value == this.data?.status);

            this.dialog
                .open(DialogUpdateStatusComponent, {
                    width: '500px',
                    data: {
                        orders: [this.data],
                        status: ORDER_STATUS.filter((e) => e.id == currStatus.id || e.id == currStatus.id + 1),
                    },
                })
                .afterClosed()
                .subscribe(() => {
                    this.ngOnInit();
                });
        }

    }

    clickUpdateTack(data: any) {
        this.dialog
            .open(DialogUpdateDeliveryComponent, {
                width: '500px',
                data: {
                    order_list_id: data.id,
                    order_list: data
                },
            })
            .afterClosed()
            .subscribe(() => {
                this.ngOnInit();
            });
    }

    clickUpdateOrderListStatus(
        status: 'waiting_for_review' | 'reviewed' | 'reject'
    ) {
        this._service
            .updateStatusOrderListAll({
                order_lists: this.seleteListAll,
                status: status,
            })
            .subscribe({
                next: (resp: any) => {
                    this.selectAll = false;
                    this.toastr.success(this.translocoService.translate('toastr.update_status'));
                    this.ngOnInit();
                },
                error: (error: any) => {
                    this.toastr.error(this.translocoService.translate('toastr.update_status_error'));
                },
            });
    }

    formatToTwoDecimalPlaces(input: string): string {
        const number = parseFloat(input);
        if (isNaN(number)) {
            return '0.00'; // หรือจะให้ return ค่าว่างหรือ throw error ก็ได้ตามการใช้งาน
        }
        return number.toFixed(4);
    }

    showPicture(imgObject: any): void {
        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }

    imageLoadedMap: { [key: string]: boolean } = {};

    onImageError(id: string) {
        this.imageLoadedMap[id] = false;
    }

    onImageLoad(id: string) {
        this.imageLoadedMap[id] = true;
    }
    ////////////////////////////////////////////////////////////////
    onOrderListFieldChange(
        orderList: any,
        field: 'product_real_price' | 'product_negotiated_price',
        value: any
    ): void {
        const normalizedValue = this.normalizePriceValue(value);

        orderList[field] = normalizedValue;

        const rawIndex = this.data?.order_lists?.findIndex((item) => item.id === orderList.id) ?? -1;
        if (rawIndex !== -1) {
            this.data.order_lists[rawIndex][field] = normalizedValue;
        }

        const controlIndex = this.orderLists.controls.findIndex(
            (ctrl) => ctrl.get('order_list_id')?.value === orderList.id
        );

        if (controlIndex !== -1) {
            this.orderLists.at(controlIndex).patchValue({ [field]: normalizedValue });
        }
    }

    private normalizePriceValue(value: any): number | null {
        if (value === null || value === undefined || value === '') {
            return null;
        }

        const numericValue =
            typeof value === 'number'
                ? value
                : parseFloat(value.toString().replace(/,/g, ''));

        return Number.isNaN(numericValue) ? null : numericValue;
    }


    getShipmentMethod(shippedBy: string): string {
        if (shippedBy === 'Car' || shippedBy === 'car') {
            return 'ขนส่งทางรถ';
        } else if (shippedBy === 'Ship' || shippedBy === 'ship') {
            return 'ขนส่งทางเรือ';
        } else if (shippedBy === 'Train' || shippedBy === 'train') {
            return 'ขนส่งทางรถไฟ';
        } else {
            return '-';
        }
    }

    deposit_fee: number = 0;
    china_shipping_fee: number = 0;
    totalFee: number = 0;
    totalInBaht: number = 0;
    calculateTotalFee() {
        const deposit = Number(this.deposit_fee) || 0;
        const shipping = Number(this.china_shipping_fee) || 0;
        this.totalFee = deposit + shipping;

        this.totalInBaht = this.totalFee * this.data?.order_lists[0]?.rate; // ถ้ามี exchange_rate
    }
    calculateSummary() {
        const lists = this.data.order_lists;
        this.deposit_fee = Number(this.data?.deposit_fee)
        this.china_shipping_fee = Number(this.data?.china_shipping_fee)
        const deposit = Number(this.deposit_fee) || 0;
        const shipping = Number(this.china_shipping_fee) || 0;
        this.totalFee = deposit + shipping;
        this.summary.totalQty = lists.reduce((sum, item) => sum + item.product_qty, 0);
        this.summary.totalPriceYuan = lists.reduce(
            (sum, item) => sum + item.product_real_price * item.product_qty,
            0
        );

        // ใช้ rate แรก ถ้าหลายรายการควรหาค่าเฉลี่ยหรือตามเงื่อนไขระบบ
        this.summary.rate = lists.length ? lists[0].rate : 0;

        // แปลงเป็นบาท
        this.summary.totalPriceBaht = this.summary.totalPriceYuan * this.summary.rate;

        this.summary.chinaShippingBaht = this.data.china_shipping_fee * this.summary.rate;
        this.summary.serviceFeeBaht = 0
        this.summary.otherFeeYuan = this.data.deposit_fee * this.summary.rate;
        this.summary.depositFee = 0
        this.summary.totalFinalBaht =
            (+this.summary.totalPriceBaht) +
            (+this.summary.chinaShippingBaht) +
            (+this.summary.serviceFeeBaht) +
            (+this.summary.otherFeeYuan);

    }

    onImageErrorOrderList(item: any): void {
        item.imageError = true;
    }
}
