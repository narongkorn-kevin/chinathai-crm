import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    merge,
    ReplaySubject,
    Subject,
    takeUntil,
} from 'rxjs';
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
import { MatCheckbox } from '@angular/material/checkbox';
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
import { DialogAddressComponent } from './dialog-address/dialog-address.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ExportService } from 'app/modules/shared/export.service';
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
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-delivery-orders',
    standalone: true,
    imports: [
        TranslocoModule,
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
    ],
    providers: [CurrencyPipe, DatePipe],
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
    lang_type = {
        type_a: { th: 'ประเภท A', en: 'Type A', cn: 'A型' },
        type_b: { th: 'ประเภท B', en: 'Type B', cn: 'B型' },
        type_c: { th: 'ประเภท C', en: 'Type C', cn: 'C型' },
        type_d: { th: 'ประเภท D', en: 'Type D', cn: 'D型' },
        type_cb: { th: 'ประเภท CB', en: 'Type CB', cn: 'CB型' },
        type_cd: { th: 'ประเภท CD', en: 'Type CD', cn: 'CD型' },
        type_cf: { th: 'ประเภท CF', en: 'Type CF', cn: 'CF型' },
    };
    sumdashbord = {
        total_items: 0,
        categories: [
            {
                name: 'ประเภท A',
                boxes: 0,
                cbm: 0,
            },
            {
                name: 'ประเภท B',
                boxes: 0,
                cbm: 0,
            },
            {
                name: 'ประเภท C',
                boxes: 0,
                cbm: 0,
            },
            {
                name: 'ประเภท D',
                boxes: 0,
                cbm: 0,
            },
            {
                name: 'ประเภท CB',
                boxes: 0,
                cbm: 0,
            },
            {
                name: 'ประเภท CD',
                boxes: 0,
                cbm: 0,
            },
            {
                name: 'ประเภท CF',
                boxes: 0,
                cbm: 0,
            },
        ],
        summary: {
            total_orders: 0,
            total_cbm: 0,
            total_weight_kg: 0,
            transport_truck: 0,
            transport_ship: 0,
        },
    };

    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dataRow: any[] = [];

    filterForm: FormGroup;
    showFilterForm: boolean = false;

    @ViewChild('btNg') btNg: any;
    @ViewChild('gotoRoute') gotoRoute: any;
    @ViewChild('checkbox_head') checkbox_head: any;
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('date') date: any;
    @ViewChild('status') status: any;
    @ViewChild('statusshipment') statusshipment: any;
    @ViewChild('importerCode') importerCode: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    category: any[] = ['A', 'B', 'C', 'D'];

    // trackings:any[] = [];
    memberFilter = new FormControl('');
    filterMember: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    members: any[] = [];
    stores: any[] = [];
    category_products: any[] = [];
    transports: any[] = [];
    product_types: any[] = [];
    dashboard_delivery_order: any;
    @ViewChild('tableElement') tableElement!: ElementRef;
    statusOptions = [
        { value: 'arrived_china_warehouse', label: 'ถึงคลังสินค้าที่จีน' },
        { value: 'in_transit', label: 'กำลังขนส่ง' },
        { value: 'arrived_thailand_warehouse', label: 'ถึงคลังสินค้าที่ไทย' },
        { value: 'awaiting_payment', label: 'รอการชำระเงิน' },
        { value: 'delivered', label: 'ส่งมอบเรียบร้อยแล้ว' },
    ];
    // ตั้งค่ากราฟ ApexCharts
    public chartOptions = {
        series: [1],
        chart: {
            type: 'donut',
            height: 400, // เพิ่มขนาดของกราฟให้สูงขึ้น
            width: '100%', // ขยายความกว้างของกราฟ
        },
        labels: ["ไม่มีข้อมูล"],
        colors: ["#AAAAAA"], // สีเทา
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
        dataLabels: {
            enabled: false, // ซ่อนค่าบนกราฟ
        },
        legend: {
            show: false, // ซ่อน Legend ของกราฟ
        }
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
        private translocoService: TranslocoService,
        private exportService: ExportService,
        private datePipe: DatePipe
    ) {
        this.filterForm = this._fb.group({
            start_date: [''],
            end_date: [''],
            po_no: [''],
            product_name: [''],
            member_id: [''],
            shipment_code: [''],
            store_id: [''],
            product_type_id: [''],
            shipment_by: [''],
            status: [''],
            packing_list_code: [''],
        });

        // this.trackings = this.activated.snapshot.data.tracking.data
        this.members = this.activated.snapshot.data?.members?.data;
        this.stores = this.activated.snapshot.data?.stores?.data;
        this.category_products =
            this.activated.snapshot.data?.category_products?.data;
        this.transports = this.activated.snapshot.data?.transports?.data;
        this.product_types = this.activated.snapshot.data?.product_types?.data;
        this.dashboard_delivery_order =
            this.activated.snapshot.data?.dashboard_delivery_order?.data;
        this.filterMember.next(this.members.slice());

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

        if (this.dashboard_delivery_order) {
            this.sumdashbord.total_items =
                this.dashboard_delivery_order.total_items;
            this.sumdashbord.summary.total_cbm =
                this.dashboard_delivery_order.cbm_total;
            this.sumdashbord.summary.total_weight_kg =
                this.dashboard_delivery_order.weight_total_kg;
            this.sumdashbord.summary.transport_truck =
                this.dashboard_delivery_order.road_transport;
            this.sumdashbord.summary.transport_ship =
                this.dashboard_delivery_order.sea_transport;
            this.sumdashbord.categories =
                this.dashboard_delivery_order.categories.map((cat) => {
                    const typeKey = Object.entries(this.lang_type).find(
                        ([key, value]) =>
                            value.th === cat.type ||
                            value.en === cat.type ||
                            value.cn === cat.type
                    )?.[0];

                    return {
                        name: typeKey
                            ? this.lang_type[typeKey][this.langues]
                            : cat.type, // ใช้ชื่อภาษาที่เลือก หรือค่าดั้งเดิมถ้าไม่พบ
                        boxes: cat.boxes,
                        cbm: cat.cbm,
                    };
                });
        }

        if (this.sumdashbord?.categories.reduce((total, cat) => total + cat.cbm, 0) > 0) {
            this.chartOptions = {
                series: this.sumdashbord?.categories.map((cat) => cat.cbm),
                chart: {
                    type: 'donut',
                    height: 400, // เพิ่มขนาดของกราฟให้สูงขึ้น
                    width: '100%', // ขยายความกว้างของกราฟ
                },
                labels: this.sumdashbord?.categories.map((cat) => cat.name),
                colors: [
                    '#FF0000',
                    '#CC0000',
                    '#990000',
                    '#660000',
                    '#330000',
                    '#FF6666',
                    '#FF9999',
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
        }

        this.memberFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterMember();
            });

        this.filterForm
            .get('po_no')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.getDashboardDeliveryOrder();
                this.rerender();
            });

        merge(
            this.filterForm.get('start_date')!.valueChanges.pipe(distinctUntilChanged()),
            this.filterForm.get('end_date')!.valueChanges.pipe(distinctUntilChanged())
        )
            .pipe(
                debounceTime(500)
            )
            .subscribe(() => {
                const start = this.filterForm.get('start_date')!.value;
                const end = this.filterForm.get('end_date')!.value;

                if (start && end) {
                    this.rerender();
                }
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
        const menuTitles = {
            warehouseEntryDate: {
                th: 'วันที่เข้าโกดัง',
                en: 'Warehouse Entry Date',
                cn: '入库日期',
            },
            warehouseReceiptCode: {
                th: 'รหัสใบรับเข้าโกดัง',
                en: 'Warehouse Receipt Code',
                cn: '入库单号',
            },
            customerCode: {
                th: 'รหัสลูกค้า',
                en: 'Customer Code',
                cn: '客户代码',
            },
            shipmentCode: {
                th: 'รหัส Shipment',
                en: 'Shipment Code',
                cn: '运输编号',
            },
            shippingMethod: {
                th: 'ขนส่งโดย',
                en: 'Shipping Method',
                cn: '运输方式',
            },
            shippingCost: { th: 'ค่าขนส่ง', en: 'Shipping Cost', cn: '运费' },
            shippingCostStatus: {
                th: 'สถานะค่าขนส่ง',
                en: 'Shipping Cost Status',
                cn: '运费状态',
            },
            type: { th: 'ประเภท', en: 'Type', cn: '类型' },
            boxCount: { th: 'จำนวนลัง', en: 'Box Count', cn: '箱数' },
            weight: { th: 'น้ำหนัก', en: 'Weight', cn: '重量' },
            cbm: { th: 'CBM', en: 'CBM', cn: '立方米' },
            totalCost: { th: 'ค่าใช้จ่าย', en: 'Total Cost', cn: '总费用' },
            costStatus: {
                th: 'สถานะค่าใช้จ่าย',
                en: 'Cost Status',
                cn: '费用状态',
            },
            status: { th: 'สถานะ', en: 'Status', cn: '状态' },
            packingListCode: {
                th: 'รหัส Packing List',
                en: 'Packing List Code',
                cn: '装箱单编号',
            },
        };
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            scrollX: false,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                if (this.filterForm.value.start_date) {
                    dataTablesParameters.created_at = this.formatDate(
                        new Date(this.filterForm.value.start_date)
                    );
                }
                if (this.filterForm.value.end_date) {
                    dataTablesParameters.end_date = this.formatDate(
                        new Date(this.filterForm.value.end_date)
                    );
                }
                if (this.filterForm.value.po_no) {
                    dataTablesParameters.po_no = this.filterForm.value.po_no;
                }
                if (this.filterForm.value.product_name) {
                    dataTablesParameters.product_name = this.filterForm.value.product_name;
                }
                if (this.filterForm.value.member_id) {
                    dataTablesParameters.member_id =
                        this.filterForm.value.member_id;
                }
                if (this.filterForm.value.shipment_code) {
                    dataTablesParameters.shipment_code =
                        this.filterForm.value.shipment_code;
                }
                if (this.filterForm.value.store_id) {
                    dataTablesParameters.store_id =
                        this.filterForm.value.store_id;
                }
                if (this.filterForm.value.product_type_id) {
                    dataTablesParameters.product_type_id =
                        this.filterForm.value.product_type_id;
                }
                // if (this.filterForm.value.shipping_type) {
                //     dataTablesParameters.shipping_type =
                //         this.filterForm.value.shipping_type;
                // }
                if (this.filterForm.value.shipment_by) {
                    dataTablesParameters.shipment_by =
                        this.filterForm.value.shipment_by;
                }
                if (this.filterForm.value.status) {
                    dataTablesParameters.status = this.filterForm.value.status;
                }
                if (this.filterForm.value.packing_list_code) {
                    dataTablesParameters.packing_list_code =
                        this.filterForm.value.packing_list_code;
                }
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
                    title: menuTitles.warehouseEntryDate[this.langues],
                    data: 'date',
                    className: 'w-10 text-center',
                    // ngTemplateRef: {
                    //     ref: this.date,
                    // },
                },
                {
                    title: menuTitles.warehouseReceiptCode[this.langues],
                    data: 'code',
                    className: 'w-30 text-center',
                    ngTemplateRef: {
                        ref: this.gotoRoute,
                    },
                },
                {
                    title: menuTitles.customerCode[this.langues],
                    data: null,
                    ngTemplateRef: {
                        ref: this.importerCode,
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.shipmentCode[this.langues],
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
                    title: menuTitles.shippingMethod[this.langues],
                    data: function (row: any) {
                        if (!row) {
                            return '-';
                        }
                        if (row.shipment_by === 'Car') {
                            return 'ขนสงทางรถ';
                        } if (row.shipment_by === 'Ship') {
                            return 'ขนสงทางเรือ';
                        } else {
                            return '-';
                        }
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.shippingCost[this.langues],
                    data: null,
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.shippingCostStatus[this.langues],
                    data: null,
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.status,
                    },
                },
                {
                    title: menuTitles.type[this.langues],
                    data: 'product_type.name',
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.boxCount[this.langues],
                    data: 'sum_qty_box',
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.weight[this.langues],
                    data: 'sum_weight',
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.cbm[this.langues],
                    data: 'sum_cbm',
                    defaultContent: '-',
                    className: 'text-center',
                    render: function (data: any, type: any, row: any) {
                        if (data == null || isNaN(data)) return '-';
                        return parseFloat(data).toFixed(4);
                    }
                },
                {
                    title: menuTitles.totalCost[this.langues],
                    data: null,
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.costStatus[this.langues],
                    data: null,
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.statusshipment,
                    },
                },
                {
                    title: menuTitles.status[this.langues],
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
            ],
            dom: 'lfrtip',
            buttons: [
                {
                    extend: 'copy',
                    className: 'btn-csv-hidden',
                },
                {
                    extend: 'csv',
                    className: 'btn-csv-hidden',
                },
                {
                    extend: 'excel',
                    className: 'btn-csv-hidden',
                },
                {
                    extend: 'print',
                    className: 'btn-csv-hidden',
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

    getDashboardDeliveryOrder() {
        const formValue = this.filterForm.value;
        // ตรวจสอบว่า start_date มีค่าหรือไม่
        if (formValue.start_date) {
            formValue.start_date = this.formatDate(new Date(formValue.start_date));
        }

        // ตรวจสอบว่า end_date มีค่าหรือไม่
        if (formValue.end_date) {
            formValue.end_date = this.formatDate(new Date(formValue.end_date));
        }
        const params: any = {};
        Object.keys(formValue).forEach(key => {
            if (formValue[key] !== null && formValue[key] !== '') {
                params[key] = formValue[key];
            }
        });
        this._service.getDashboardDeliveryOrderFilter(params).subscribe((resp: any) => {
            this.dashboard_delivery_order = resp.data;
            if (this.dashboard_delivery_order) {
                this.sumdashbord.total_items =
                    this.dashboard_delivery_order.total_items;
                this.sumdashbord.summary.total_cbm =
                    this.dashboard_delivery_order.cbm_total;
                this.sumdashbord.summary.total_weight_kg =
                    this.dashboard_delivery_order.weight_total_kg;
                this.sumdashbord.summary.transport_truck =
                    this.dashboard_delivery_order.road_transport;
                this.sumdashbord.summary.transport_ship =
                    this.dashboard_delivery_order.sea_transport;
                this.sumdashbord.categories =
                    this.dashboard_delivery_order.categories.map((cat) => {
                        const typeKey = Object.entries(this.lang_type).find(
                            ([key, value]) =>
                                value.th === cat.type ||
                                value.en === cat.type ||
                                value.cn === cat.type
                        )?.[0];

                        return {
                            name: typeKey
                                ? this.lang_type[typeKey][this.langues]
                                : cat.type, // ใช้ชื่อภาษาที่เลือก หรือค่าดั้งเดิมถ้าไม่พบ
                            boxes: cat.boxes,
                            cbm: cat.cbm,
                        };
                    });
            }

            if (this.sumdashbord?.categories.reduce((total, cat) => total + cat.cbm, 0) > 0) {
                this.chartOptions = {
                    series: this.sumdashbord?.categories.map((cat) => cat.cbm),
                    chart: {
                        type: 'donut',
                        height: 400, // เพิ่มขนาดของกราฟให้สูงขึ้น
                        width: '100%', // ขยายความกว้างของกราฟ
                    },
                    labels: this.sumdashbord?.categories.map((cat) => cat.name),
                    colors: [
                        '#FF0000',
                        '#CC0000',
                        '#990000',
                        '#660000',
                        '#330000',
                        '#FF6666',
                        '#FF9999',
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
            }
        })
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

    openDialogaddress(selectedItem: any) {
        console.log(selectedItem);

        if (selectedItem.length === 0) {
            if (selectedItem.length === 0) {
                let message = '';
                switch (this.langues) {
                    case 'en':
                        message = 'Please select an item first';
                        break;
                    case 'th':
                        message = 'กรุณาเลือกรายการก่อน';
                        break;
                    case 'cn':
                        message = '请先选择一个项目';
                        break;
                    default:
                        message = 'Please select an item first';
                }

                this.toastr.warning(message, 'Warning');
                return;
            }
            return;
        }

        const DialogRef = this.dialog.open(DialogAddressComponent, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: selectedItem
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
                const id = this.multiSelect;
                console.log(id, 'id');

                for (let i = 0; i < id.length; i++) {
                    this._service.delete(id[i]).subscribe({
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate(
                                    'toastr.delete_error'
                                )
                            );
                            console.log(err, 'err');
                        },
                        complete: () => {
                            if (i == id.length - 1) {
                                this.multiSelect = [];
                                this.toastr.success(
                                    this.translocoService.translate(
                                        'toastr.delete'
                                    )
                                );
                                this.rerender();
                            }
                        },
                    });
                }
                if (id.length === 1) {
                    this.rerender();
                }
            }
        });
    }
    showPicture(imgObject: string): void {
         
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

    openfillter() {
        this.filterForm.reset();
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
            this.members.filter(
                (item) =>
                    item.code.toLowerCase().includes(search) ||
                    (
                        item.fname.toLowerCase() +
                        ' ' +
                        item.lname.toLowerCase()
                    ).includes(search) ||
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
            this.memberFilter.setValue(
                `[ ${selectedData.code} ] ${selectedData.fname} ${selectedData.lname}`
            );
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
            member_id: item?.id,
        });
    }

    exportData(type: 'csv' | 'excel' | 'print' | 'copy') {
        this.exportService.exportTable(this.tableElement, type);
    }

    formatDate(date: Date): string {
        return this.datePipe.transform(date, 'yyyy-MM-dd', 'Asia/Bangkok');
    }

    onChangeFilter() {
        this.getDashboardDeliveryOrder();
        this.rerender();
    }

}
