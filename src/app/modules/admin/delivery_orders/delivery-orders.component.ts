import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { map, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PictureComponent } from '../picture/picture.component';
import { ProductComposeComponent } from '../product/dialog/product-compose/product-compose.component';
import { DeliveryOrdersService } from './delivery-orders.service';
import { DialogForm } from './form-dialog/dialog.component';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormComponent } from './form/form.component';
import { ImportexcelComponent } from './import-excel/importexcel.component';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { CdkMenuModule } from '@angular/cdk/menu';
import { DialogStockInComponent } from '../dialog/dialog-stock-in/dialog.component';
import { DialogTrackingComponent } from '../dialog/dialog-tracking/dialog.component';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogImageComponent } from './dialog-image/dialog-image.component';
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

interface TableItem {
    no: number;
    warehouse: string;
    lotNo: string;
    status: string;
    transport: string;
    cartonNo: string;
    selected: boolean;
    imageSelected: boolean;
}
@Component({
    selector: 'app-delivery-orders',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatCheckbox,
        RouterLink,
        MatIcon,
        CdkMenuModule,
        NgApexchartsModule,
        MatAutocompleteModule,
        SelectMemberComponent,
        MatTabsModule
    ],
    providers: [CurrencyPipe],
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
    templateUrl: './delivery-orders.component.html',
    styleUrl: './delivery-orders.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class DeliveryOrdersComponent implements OnInit, AfterViewInit {
    historyData = [
        {
            date: '2025-06-20, 09:45',
            trackNo: 'CN202506200001',
            tackingExt: '1/3',
            remark: 'รับสินค้าเข้าระบบ',
            by: 'admin_china'
        },
        {
            date: '2025-06-21, 10:30',
            trackNo: 'CN202506200001',
            tackingExt: '2/3',
            remark: 'ตรวจสอบน้ำหนัก',
            by: 'admin_china'
        },
        {
            date: '2025-06-22, 11:15',
            trackNo: 'CN202506200001',
            tackingExt: '3/3',
            remark: 'แก้ไขรายการสินค้า',
            by: 'admin_china'
        }
    ];


    orderStatus: any
    sumdashbord = {
        total_items: 100,
        categories: [
            { name: 'ประเภท A', boxes: 10, cbm: 10 },
            { name: 'ประเภท B', boxes: 30, cbm: 30 },
            { name: 'ประเภท C', boxes: 30, cbm: 30 },
            { name: 'ประเภท D', boxes: 30, cbm: 30 },
        ],
        summary: {
            total_orders: 120,                // จำนวนออเดอร์ทั้งหมด
            total_cbm: 235.4,                 // CBM รวมของสินค้าทั้งหมด
            total_weight_kg: 1842.7,         // น้ำหนักรวม (Kg)
            transport_truck: 150.2,          // CBM ที่ส่งทางรถ
            transport_ship: 85.2             // CBM ที่ส่งทางทางเรือ
        }
    };

    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dataRow: any[] = [];

    filterForm: FormGroup;
    showFilterForm: boolean = false;

    expanded: boolean[] = [];

    data: TableItem[] = [
        {
            no: 1,
            warehouse: 'คลัง A',
            lotNo: 'LOT001',
            status: 'พร้อมส่ง',
            transport: 'ทางรถ',
            cartonNo: 'C1001',
            selected: false,
            imageSelected: false
        },
        {
            no: 2,
            warehouse: 'คลัง B',
            lotNo: 'LOT002',
            status: 'กำลังแพ็ค',
            transport: 'ทางเรือ',
            cartonNo: 'C1002',
            selected: false,
            imageSelected: false
        },
        {
            no: 3,
            warehouse: 'คลัง C',
            lotNo: 'LOT003',
            status: 'ตรวจสอบ',
            transport: 'เครื่องบิน',
            cartonNo: 'C1003',
            selected: false,
            imageSelected: false
        },
        {
            no: 4,
            warehouse: 'คลัง A',
            lotNo: 'LOT004',
            status: 'พร้อมส่ง',
            transport: 'รถไฟ',
            cartonNo: 'C1004',
            selected: false,
            imageSelected: false
        },
        {
            no: 5,
            warehouse: 'คลัง D',
            lotNo: 'LOT005',
            status: 'กำลังขนส่ง',
            transport: 'ทางรถ',
            cartonNo: 'C1005',
            selected: false,
            imageSelected: false
        },
        {
            no: 6,
            warehouse: 'คลัง B',
            lotNo: 'LOT006',
            status: 'ถึงปลายทาง',
            transport: 'ทางเรือ',
            cartonNo: 'C1006',
            selected: false,
            imageSelected: false
        },
        {
            no: 7,
            warehouse: 'คลัง E',
            lotNo: 'LOT007',
            status: 'พร้อมส่ง',
            transport: 'เครื่องบิน',
            cartonNo: 'C1007',
            selected: false,
            imageSelected: false
        },
        {
            no: 8,
            warehouse: 'คลัง A',
            lotNo: 'LOT008',
            status: 'กำลังแพ็ค',
            transport: 'ทางรถ',
            cartonNo: 'C1008',
            selected: false,
            imageSelected: false
        },
        {
            no: 9,
            warehouse: 'คลัง C',
            lotNo: 'LOT009',
            status: 'ตรวจสอบ',
            transport: 'รถไฟ',
            cartonNo: 'C1009',
            selected: false,
            imageSelected: false
        },
        {
            no: 10,
            warehouse: 'คลัง D',
            lotNo: 'LOT010',
            status: 'ถึงปลายทาง',
            transport: 'ทางเรือ',
            cartonNo: 'C1010',
            selected: false,
            imageSelected: false
        }
    ];

    @ViewChild('btNg') btNg: any;
    @ViewChild('gotoRoute') gotoRoute: any;
    @ViewChild('checkbox_head') checkbox_head: any;
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('date') date: any;
    @ViewChild('status') status: any;
    @ViewChild('statusshipment') statusshipment: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    category: any[] = ['A', 'B', 'C', 'D'];
    barcodeList = Array.from({ length: 6 }).map((_, i) => ({
        productType: 'แผ่นเหล็ก',
        shelf: 'C',
        weight: 3.6,
        date: '2023-12-06',
        code: 'INTL0325277',
        barcode: 'PH003-001',
        barcodeImg: 'https://bwipjs-api.metafloor.com/?bcid=code128&text=PH003-001&scale=3&includetext' // external barcode image
    }));

    // trackings:any[] = [];
    memberFilter = new FormControl('');
    filterMember: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    members: any[] = [];
    stores: any[] = [];
    category_products: any[] = [];
    transports: any[] = [];
    product_types: any[] = [];

    statusOptions = [
        { value: 'arrived_china_warehouse', label: 'ถึงคลังสินค้าที่จีน' },
        { value: 'in_transit', label: 'กำลังขนส่ง' },
        { value: 'arrived_thailand_warehouse', label: 'ถึงคลังสินค้าที่ไทย' },
        { value: 'awaiting_payment', label: 'รอการชำระเงิน' },
        { value: 'delivered', label: 'ส่งมอบเรียบร้อยแล้ว' }
    ];
    // ตั้งค่ากราฟ ApexCharts
    public chartOptions: Partial<ChartOptions> = {
        // series: this.categories.map(cat => cat.cbm),
        // chart: {
        //     type: "donut"
        // },
        // labels: this.categories.map(cat => cat.name),
        // colors: ["#FF0000", "#CC0000", "#990000", "#660000", "#330000", "#FF6666", "#FF9999"],
        // responsive: [{
        //     breakpoint: 480,
        //     options: {
        //         chart: {
        //             width: 200
        //         },
        //         legend: {
        //             position: "bottom"
        //         }
        //     }
        // }]
    };

    constructor(
        private _service: DeliveryOrdersService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private currencyPipe: CurrencyPipe,
        private _router: Router,
        private _fb: FormBuilder,
        private activated: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.filterForm = this._fb.group({
            name: [''],
            code: [''],
            member_id: [''],
            shipment: [''],
            store: [''],
            category_product: [''],
            tracking: [''],
            status: [''],
            packing_list: [''],
            start_date: [''],
            end_date: [''],
        });

        // this.trackings = this.activated.snapshot.data.tracking.data
        this.members = this.activated.snapshot.data?.members?.data
        this.stores = this.activated.snapshot.data?.stores?.data
        this.category_products = this.activated.snapshot.data?.category_products?.data
        this.transports = this.activated.snapshot.data?.transports?.data
        this.product_types = this.activated.snapshot.data?.product_types?.data
        this.filterMember.next(this.members.slice());
        this.expanded = new Array(this.data.length).fill(false);
    }
    ngOnInit(): void {
        setTimeout(() => this.loadTable());

        this.chartOptions = {
            n_series: this.sumdashbord?.categories.map((cat) => cat.cbm),
            chart: {
                type: 'donut',
                height: 150, // เพิ่มขนาดของกราฟให้สูงขึ้น
                width: '100%', // ขยายความกว้างของกราฟ
            },
            labels: this.sumdashbord?.categories.map((cat) => cat.name),
            colors: [
                '#1E90FF',  // Dodger blue
                '#187BCD',  // Strong blue
                '#1464A5',  // Navy-ish blue
                '#0D4B7E',  // Dark navy blue
            ],
            legend: {
                show: false, // ซ่อน Legend ของกราฟ
            },
            dataLabels: {
                enabled: false, // ซ่อนค่าบนกราฟ
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: {
                            width: '100%',
                            height: 250,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };

        this.memberFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterMember();
            });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }

    protected _onDestroy = new Subject<void>();

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    onChangeType() {
        this.rerender();
    }

    rows: any[] = [];

    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            scrollX: true,
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
                    title: 'วันที่เข้าโกดัง',
                    data: 'date',
                    className: 'w-10 text-center',
                    // ngTemplateRef: {
                    //     ref: this.date,
                    // },
                },
                {
                    title: 'รหัสใบรับเข้าโกดัง',
                    data: 'code',
                    className: 'w-30 text-center',
                    ngTemplateRef: {
                        ref: this.gotoRoute,
                    },
                },
                {
                    title: 'รหัสลูกค้า',
                    data: function (row: any) {
                        if (!row.member) {
                            return '-';
                        }
                        return row.member?.code;
                    },
                    className: 'text-center',
                },
                {
                    title: 'รหัส Shipment',
                    data: function (row: any) {
                        if (!row.shipment) {
                            return '-';
                        }
                        return row.shipment;
                    },
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: 'ขนส่งโดย',
                    data: function (row: any) {
                        if (!row.order) {
                            return '-';
                        }
                        if (row.order.shipping_type === 'Car') {
                            return 'ขนสงทางรถ';
                        } else {
                            return 'ขนสงทางทางเรือ';
                        }
                    },
                    className: 'text-center',
                },
                {
                    title: 'ค่าขนส่ง',
                    data: function (row: any) {
                        if (!row.order) {
                            return '-';
                        }
                        return Number(row.order.total_price).toFixed(2);
                    },
                    className: 'text-center',
                },
                {
                    title: 'สถานะค่าขนส่ง',
                    data: null,
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.status,
                    },
                },
                {
                    title: 'ประเภท',
                    data: 'A',
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: 'จำนวนลัง',
                    data: null,
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: 'นำหนัก',
                    data: null,
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: 'CBM',
                    data: null,
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: 'ค่าใช้จ่าย',
                    data: null,
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: 'สถานะค่าใช้จ่าย',
                    data: null,
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.statusshipment,
                    },
                },
                {
                    title: 'สถานะ',
                    data: function (row: any) {
                        if (!row.status) {
                            return '-';
                        }
                        switch (row.status) {
                            case 'pending':
                                return 'รอชำระ';
                            case 'arrived_china_warehouse':
                                return 'ถึงคลังสินค้าที่จีน';
                            case 'in_transit':
                                return 'กำลังขนส่ง';
                            case 'arrived_thailand_warehouse':
                                return 'ถึงคลังสินค้าที่ไทย';
                            case 'awaiting_payment':
                                return 'รอการชำระเงิน';
                            case 'delivered':
                                return 'ส่งมอบเรียบร้อยแล้ว';
                            default:
                                return '-';
                        }
                    },
                    className: 'text-center',
                },
                {
                    title: 'รหัส Packing List',
                    data: null,
                    defaultContent: '-',
                    className: 'text-center',
                },
            ],
        };
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }

    opendialogapro2() {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    openForm() {
        this._router.navigate(['delivery_orders/form']);
    }
    openFormSetting() {
        this._router.navigate(['delivery_orders/setting']);
    }

    openImportExcelDialog() {
        const DialogRef = this.dialog.open(ImportexcelComponent, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {},
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    opendialogdelete() {
        const confirmation = this.fuseConfirmationService.open({
            title: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการ?',
            message:
                'คุณกำลังจะ ลบรายการ หากกดยืนยันแล้วจะไม่สามารถเอากลับมาอีกได้',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            // if (result == 'confirmed') {
            //     const id = this.multiSelect;
            //     console.log(id, 'id');

            //     for (let i = 0; i < id.length; i++) {
            //         this._service.delete(id[i]).subscribe({
            //             error: (err) => {
            //                 this.toastr.error(
            //                     'ลบรายการสมาชิก ล้มเหลว โปรดลองใหม่อีกครั้งภายหลัง'
            //                 );
            //                 console.log(err, 'err');
            //             },
            //             complete: () => {
            //                 if (i == id.length - 1) {
            //                     this.multiSelect = [];
            //                     this.toastr.success('ลบรายการสมาชิก สำเร็จ');
            //                     this.rerender();
            //                 }
            //             },
            //         });
            //     }
            //     if (id.length === 1) {
            //         this.rerender();
            //     }
            // }
        });
    }
    showPicture(imgObject: string): void {
        console.log(imgObject);
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
    createProduct() {
        const DialogRef = this.dialog.open(ProductComposeComponent, {
            disableClose: true,
            width: '800px',
            height: '90%',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    // multiSelect: any[] = [];



    openfillter() {
        this.showFilterForm = !this.showFilterForm;
    }

    applyFilter() {
        const filterValues = this.filterForm.value;
        console.log(filterValues);
        this.rerender();
    }
    clearFilter() {
        this.filterForm.reset();
        this.rerender();
    }

    opendialoga() {
        const DialogRef = this.dialog.open(DialogStockInComponent, {
            disableClose: true,
            width: '900px',
            height: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    protected _filterMember() {
        if (!this.members) {
            return;
        }
        let search = this.memberFilter.value;

        if (!search) {
            this.filterMember.next(this.members.slice());
            return;
        } else {
            search = search.toString().toLowerCase();
        }

        // กรองข้อมูลโดยค้นหาใน code, firstname และ lastname
        this.filterMember.next(
            this.members.filter(item =>
                item.code.toLowerCase().includes(search) ||
                (item.fname.toLowerCase() + ' ' + item.lname.toLowerCase()).includes(search) ||
                item.fname.toLowerCase().includes(search) ||
                item.lname.toLowerCase().includes(search)
            )
        );
    }

    onSelectMember(event: any) {
        if (!event) {
            if (this.memberFilter.invalid) {
                this.memberFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No Member Selected');
            return;
        }

        const selectedData = event; // event จะเป็นออบเจ็กต์ item

        if (selectedData) {
            this.filterForm.patchValue({
                member: selectedData.code,
            });
            this.memberFilter.setValue(`[ ${selectedData.code} ] ${selectedData.fname} ${selectedData.lname}`);
        } else {
            if (this.memberFilter.invalid) {
                this.memberFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No Member Found');
            return;
        }
    }
    selectMember(item: any) {
        this.filterForm.patchValue({
            member_id: item?.id
        })
    }

    get multiSelect(): TableItem[] {
        // ใช้ filter โดยตรงและ return array ใหม่ทุกครั้ง
        return this.data.filter(item => item.selected);
    }

    // แก้ไขเมธอด toggleExpand
    toggleExpand(index: number, event?: MouseEvent): void {
        // หยุดการ propagate event ถ้ามาจากการคลิก checkbox
        if (event && (event.target as Element).closest('mat-checkbox')) {
            event.stopPropagation();
            return;
        }
        this.expanded[index] = !this.expanded[index];
    }

    // แก้ไข method นี้
    toggleItemSelection(item: TableItem, event?: MatCheckboxChange): void {
        // ถ้ามี event ให้ใช้ค่าจาก event นั้น
        const newState = event ? event.checked : !item.selected;
        item.selected = newState;

        // Force change detection (ในกรณีที่จำเป็น)
        this.changeDetectorRef.detectChanges();

        // Log ตรวจสอบ (สำหรับ debug)
        console.log('Item selection changed:', item.no, item.selected);
        console.log('Current multiSelect:', this.multiSelect);
    }

    // Toggle all checkboxes
    toggleAllSelection(event: any): void {
        const checked = event.checked;
        this.data.forEach(item => item.selected = checked);
    }

    // Check if all items are selected
    isAllSelected(): boolean {
        return this.data.length > 0 && this.data.every(item => item.selected);
    }

    // Check if some items are selected
    someItemsSelected(): boolean {
        return this.multiSelect.length > 0 && !this.isAllSelected();
    }

    // Action buttons functions
    printBarcode(): void {
        console.log('Printing barcodes for:', this.multiSelect);
        // Implement your barcode printing logic
    }

    editMultiple(): void {
        console.log('Editing multiple items:', this.multiSelect);
        // Implement your multi-edit logic
    }

    deleteItems(): void {
        console.log('Deleting items:', this.multiSelect);
        // Implement your delete logic
        this.data = this.data.filter(item => !item.selected);
    }

    // เพิ่มเมธอดสำหรับ handle การคลิก checkbox โดยเฉพาะ
    handleCheckboxClick(item: TableItem, event: MouseEvent): void {
        event.stopPropagation();
        this.toggleItemSelection(item);
    }

    printBarcodes() {
        let html = `
      <html>
        <head>
          <title>พิมพ์บาร์โค้ด</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 12px;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }
            .card {
              border: 1px solid #000;
              padding: 12px;
            }
            .barcode {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin-top: 4px;
            }
            .barcode img {
              display: block;
              margin: 0 auto;
              height: 50px;
            }
            .address {
              margin-top: 6px;
              font-size: 11px;
            }
          </style>
        </head>
        <body onload="window.print()">
          <div class="grid">
    `;

        for (const item of this.barcodeList) {
            html += `
        <div class="card">
          <div><strong>CT001</strong></div>
          <div>ประเภทสินค้า: ${item.productType}</div>
          <div>ชั้น: ${item.shelf}</div>
          <div>น้ำหนัก: ${item.weight} KG</div>
          <div>วันที่: ${item.date}</div>
          <div>รหัส: ${item.code}</div>

          <div class="barcode">${item.barcode}</div>
          <img src="${item.barcodeImg}" />

          <div class="address">
            ผู้รับ: สมชัย กันทาเทศ<br/>
            ที่อยู่: สมชัย ตำบล ท่าวังทอง บ้านเลขที่ 63/2<br/>
            อ.เมืองพะเยา จ.พะเยา 56000<br/>
            เบอร์โทร: 0991234567
          </div>
        </div>
      `;
        }

        html += `
          </div>
        </body>
      </html>
    `;

        const newWin = window.open('', '_blank');
        if (newWin) {
            newWin.document.open();
            newWin.document.write(html);
            newWin.document.close();
        }
    }

     openImageDialog() {
        const DialogRef = this.dialog.open(DialogImageComponent, {
            disableClose: true,
            width: '900px',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }
}
