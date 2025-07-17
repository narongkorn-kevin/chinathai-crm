import { CdkMenuModule } from '@angular/cdk/menu';
import { Subject, Subscription } from 'rxjs';
import {
    Component,
    OnInit,
    OnChanges,
    Inject,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    Validators,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { CreditService } from '../credit.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    MatDatepicker,
    MatDatepickerModule,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { DeliveryService } from '../delivery.service';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { DialogQRCodeComponent } from 'app/modules/common/dialog-qrcode/dialog-qrcode.component';
import { debounceTime, map } from 'rxjs/operators';
import {
    ApexAxisChartSeries,
    ApexNonAxisChartSeries,
    ApexChart,
    ApexResponsive,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
    ApexStroke,
    ApexLegend,
    NgApexchartsModule,
} from 'ng-apexcharts';
import {
    MatProgressBar,
    MatProgressBarModule,
} from '@angular/material/progress-bar';
import { DialogSettingComponent } from '../dialog-setting/dialog-setting.component';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { DialogPoComponent } from '../dialog-po/dialog-po.component';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    n_series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    colors: string[];
};
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-member-setting',
    standalone: true,
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        MatDivider,
        RouterLink,
        SelectMemberComponent,
        CdkMenuModule,
        MatCheckboxModule,
        NgApexchartsModule,
        MatProgressBarModule,
    ],
    animations: [
        trigger('slideToggleFilter', [
            state(
                'open',
                style({
                    height: '*',
                    opacity: 1,
                    overflow: 'hidden',
                })
            ),
            state(
                'closed',
                style({
                    height: '0px',
                    opacity: 0,
                    overflow: 'hidden',
                })
            ),
            transition('open <=> closed', [animate('300ms ease-in-out')]),
        ]),
    ],
})
export class FormComponent implements OnInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    type: string;
    Id: number;
    data: any;
    lists = [];
    OrderShipment = [];
    filteredDeliveryOrders: any[] = [];
    product_types: any[] = [];
    Form: FormGroup;
    public chartOptions: Partial<ChartOptions> = {};
    dataRow: any[] = [];
    @ViewChild('checkbox') checkbox: any;
    filteredProducts: any[] = [];
    shipment_delivery_orders: any[] = [];
    productTypes: { id: number, name: string }[] = [];

    constructor(
        private translocoService: TranslocoService,
        private _changeDetectorRef: ChangeDetectorRef,
        private FormBuilder: FormBuilder,
        public _service: DeliveryService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        public dialog: MatDialog
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data.data?.data;
        this.OrderShipment = this.activated.snapshot.data.OrderShipment?.data;
        this.product_types = this.data?.product_type?.data;
        this.shipment_delivery_orders = this.data?.shipment_delivery_orders;
        this.filteredProducts = this.shipment_delivery_orders.map(
            (product) => ({
                ...product,
                IsChecked: false,
            })
        );
        console.log(this.filteredProducts, 'filteredProducts');
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    languageUrl: any;

    ngOnInit(): void {
        if (this.langues === 'en') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/en-gb.json';
        } else if (this.langues === 'th') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        } else if (this.langues === 'cn') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh.json';
        } else {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        }

        setTimeout(() => this.loadTable());
        this.filterForm = this.FormBuilder.group({
            member_id: [''],
            po_no: [''],
            shipment_by: [''],
            type: [''],
            product_type: ['']
        });

        this.filterForm.get('po_no')?.valueChanges.subscribe(() => {
            this.applyFilter();
        });
        this.filterForm.valueChanges
        .pipe(debounceTime(300))
        .subscribe(() => {
            this.applyFilter();
        });
        

        
    }
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }
    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }
    loadTable(): void {
        const menuTitles = {
            warehouse_receipt_code: {
                th: 'รหัสใบรับเข้าคลัง',
                en: 'Warehouse Receipt Code',
                cn: '入库单号',
            },
            customer_code: {
                th: 'รหัสลูกค้า',
                en: 'Customer Code',
                cn: '客户代码',
            },
            shipped_by: {
                th: 'ขนส่งโดย',
                en: 'Shipped By',
                cn: '运输方式',
            },
            shipping_cost: {
                th: 'ค่าขนส่ง',
                en: 'Shipping Cost',
                cn: '运费',
            },
            shipping_status: {
                th: 'สถานะขนส่ง',
                en: 'Shipping Status',
                cn: '运输状态',
            },
            type: {
                th: 'ประเภท',
                en: 'Type',
                cn: '类型',
            },
        };

        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            scrollX: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                this._service
                    .datatable(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            this.dataRow = resp.data;
                            callback({
                                recordsTotal: resp.total,
                                recordsFiltered: resp.total,
                                data: resp.data,
                            });
                        },
                    });
            },
            columns: [
                {
                    title: '',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.checkbox,
                    },
                    className: 'w-10 text-center',
                },
                {
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                },
                {
                    title: menuTitles.warehouse_receipt_code[this.langues],
                    data: null,
                    className: 'text-center',
                    // ngTemplateRef: {
                    //     ref: this.date,
                    // },
                },
                {
                    title: menuTitles.customer_code[this.langues],
                    data: null,
                    className: 'text-center',
                },
                {
                    title: menuTitles.shipped_by[this.langues],
                    data: null,
                    className: 'text-center',
                },
                {
                    title: menuTitles.shipping_cost[this.langues],
                    data: null,
                    className: 'text-center',
                },
                {
                    title: menuTitles.shipping_status[this.langues],
                    data: null,
                    className: 'text-center',
                },
                {
                    title: menuTitles.type[this.langues],
                    data: null,
                    className: 'text-center',
                },
            ],
        };
    }

    getShipmentMethod(shippedBy: string): string {
        if (shippedBy === 'Car') {
            return 'ขนส่งทางรถ';
        } else if (shippedBy === 'Ship') {
            return 'ขนส่งทางเรือ';
        } else if (shippedBy === 'Train') {
            return 'ขนส่งทางรถไฟ';
        } else {
            return '-';
        }
    }

    getProductTypeName(productTypeId: number): string {
        if (productTypeId === 1) {
            return 'สินค้าประเภท A';
        } else if (productTypeId === 3) {
            return 'สินค้าประเภท B';
        } else if (productTypeId === 4) {
            return 'สินค้าประเภท C';
        } else if (productTypeId === 6) {
            return 'สินค้าประเภท D';
        } else if (productTypeId === 7) {
            return 'สินค้าประเภท CB';
        } else if (productTypeId === 8) {
            return 'สินค้าประเภท CF';
        } else {
            return '-';
        }
    }

    Close() {
        this._router.navigate(['delivery']);
    }

    filterForm: FormGroup;
    showFilterForm: boolean = false;

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
        this.filteredDeliveryOrders = this.data.delivery_orders;
    }

    applyFilter() {
        const { po_no, member_id, shipment_by, product_type } = this.filterForm.value;

        console.log('📥 Filter Form Value:', this.filterForm.value);

        if (!this.data?.shipment_delivery_orders || !Array.isArray(this.data.shipment_delivery_orders)) {
            console.warn('⚠️ No shipment_delivery_orders data to filter');
            this.filteredProducts = [];
            return;
        }

        this.filteredProducts = this.data.shipment_delivery_orders.filter(order => {
            const deliveryOrder = order.delivery_order;
            if (!deliveryOrder) return false;

            const matchesPoNo = !po_no || deliveryOrder.po_no?.toLowerCase().includes(po_no.toLowerCase());
            const matchesMember = !member_id || deliveryOrder.member?.code?.toLowerCase().includes(member_id.toLowerCase());
            const matchesShipment = !shipment_by || deliveryOrder.shipment_by === shipment_by;
            const matchesProductType = !product_type || deliveryOrder.product_type_id?.toString() === product_type;

            return matchesPoNo && matchesMember && matchesShipment && matchesProductType;
        });

        console.log('✅ Filtered Result:', this.filteredProducts);
    }

    clearFilter() {
        this.filterForm.reset();
        this.filteredProducts = [...this.data.shipment_delivery_orders]; // ✅ ใช้ตัวแปรที่ตารางใช้
    }
    selectMember(event: any) {
        this.filterForm.patchValue({
            member_id: event.id,
        });
    }
    opendialogdelete() {
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate(
                'confirmation.delete_title2'
            ),
            message: this.translocoService.translate(
                'confirmation.delete_message2'
            ),
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            },
            actions: {
                confirm: {
                    show: true,
                    label: this.translocoService.translate(
                        'confirmation.confirm_button'
                    ),
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: this.translocoService.translate(
                        'confirmation.cancel_button'
                    ),
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this._service.delete(this.Id).subscribe({
                    error: (err) => {
                        this.toastr.error(
                            this.translocoService.translate(
                                'toastr.delete_fail'
                            )
                        );
                    },
                    complete: () => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.delete')
                        );
                        this._router.navigate(['pallet']);
                    },
                });
            }
        });
    }

    opendialogsetting() {
        const DialogRef = this.dialog.open(DialogSettingComponent, {
            disableClose: true,
            width: '700px',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                text: this.data?.code,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(this.lists, 'lists');
            }
        });
    }

    get totallist() {
        return this.data.delivery_orders.length;
    }
    get totalWeight() {
        return this.data.delivery_orders
            .reduce(
                (total, item) =>
                    total +
                    (isNaN(Number(item.weight)) ? 0 : Number(item.weight)),
                0
            )
            .toFixed(4);
    }
    get totalCBM() {
        return this.data.delivery_orders
            .reduce(
                (total, item) =>
                    total + (isNaN(Number(item.cbm)) ? 0 : Number(item.cbm)),
                0
            )
            .toFixed(4);
    }

    selectAll: boolean = false;

    someSelect(): boolean {
        if (this.lists == null) {
            return false;
        }
        return (
            this.lists.filter((t) => t.IsChecked).length > 0 && !this.selectAll
        );
    }

    clearSelection() {
        this.lists.forEach((item) => {
            item.IsChecked = false;
        });

        this.selectAll = false;
    }

    SelectAll(checked: boolean) {
        this.selectAll = checked; // Set isSelectAll to true when selectAll is checked

        this.lists.forEach((item) => (item.IsChecked = this.selectAll));
    }

    updateAllselect() {
        this.selectAll =
            this.lists != null && this.lists.every((t) => t.IsChecked);
        // const listArray = this.listArray;
        // this.lists.forEach((item, index) => {
        //     listArray.at(index).get('IsChecked').setValue(item.IsChecked);
        // });
    }
    get seletedList() {
        return (
            this.lists != null &&
            this.lists.filter((t) => t.IsChecked).map((e) => e.id)
        );
    }

    lotedit() {
        this._router.navigate(['/lot/edit/' + this.Id]);
    }
    sacnpo() {
        this._router.navigate(['/lot/scan-po/' + this.Id]);
    }
    draft() {
        this._router.navigate(['/lot/draft/' + this.Id]);
    }

    multiSelect: any[] = [];
    isAllSelected: boolean = false; // ใช้เก็บสถานะเลือกทั้งหมด

    toggleSelectAll(isSelectAll: boolean): void {
        this.isAllSelected = isSelectAll; // อัปเดตสถานะเลือกทั้งหมด

        if (isSelectAll) {
            // เลือกทั้งหมด: เพิ่ม id ของทุกแถวใน multiSelect
            this.dataRow.forEach((row: any) => {
                if (!this.multiSelect.includes(row.id)) {
                    this.multiSelect.push(row.id); // เพิ่ม id ถ้ายังไม่มีใน multiSelect
                }
                row.selected = true; // ตั้งค่า selected เป็น true
            });
        } else {
            // ยกเลิกการเลือกทั้งหมด: ลบ id ของทุกแถวออกจาก multiSelect
            this.dataRow.forEach((row: any) => {
                const index = this.multiSelect.indexOf(row.id);
                if (index !== -1) {
                    this.multiSelect.splice(index, 1); // ลบ id ออกจาก multiSelect
                }
                row.selected = false; // ตั้งค่า selected เป็น false
            });
        }
    }
    onCheckboxChange(event: any, id: number): void {
        if (event.checked) {
            // เพิ่ม id เข้าไปใน multiSelect
            this.multiSelect.push(id);
        } else {
            // ลบ id ออกจาก multiSelect
            const index = this.multiSelect.indexOf(id);
            if (index !== -1) {
                this.multiSelect.splice(index, 1); // ใช้ splice เพื่อลบค่าออก
            }
        }
    }
    opendialogpo() {
        const DialogRef = this.dialog.open(DialogPoComponent, {
            disableClose: true,
            width: '80%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {},
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(this.lists, 'lists');
            }
        });
    }

    selectAllProducts: boolean = false;

    someSelectProducts(): boolean {
        if (this.filteredProducts == null) {
            return false;
        }
        return this.filteredProducts.some((product) => product.IsChecked);
    }

    clearProductSelection() {
        this.filteredProducts.forEach((product) => {
            product.IsChecked = false;
        });

        this.selectAllProducts = false;
    }

    SelectAllProducts(checked: boolean) {
        this.selectAllProducts = checked; // Set isSelectAll to true when selectAll is checked

        this.filteredProducts.forEach(
            (product) => (product.IsChecked = this.selectAllProducts)
        );
    }

    updateAllSelectProducts() {
        this.selectAllProducts =
            this.filteredProducts != null &&
            this.filteredProducts.every((product) => product.IsChecked);
        this._changeDetectorRef.detectChanges(); // Trigger change detection
        console.log(this.filteredProducts, 'products');
    }

    get selectedProductList() {
        return (
            this.filteredProducts != null &&
            this.filteredProducts
                .filter((product) => product.IsChecked)
                .map((product) => product.product_id)
        );
    }

    get isAnyProductSelected(): boolean {
        return this.filteredProducts.some((product) => product.IsChecked);
    }
}
