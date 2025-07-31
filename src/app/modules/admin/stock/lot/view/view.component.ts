import { CdkMenuModule } from '@angular/cdk/menu';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
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
import { LotService } from '../lot.service';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { DialogQRCodeComponent } from 'app/modules/common/dialog-qrcode/dialog-qrcode.component';
import { debounceTime } from 'rxjs/operators';
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
import { ProgressBarComponent } from 'app/modules/common/progress-bar/progress-bar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { UploadImageComponent } from 'app/modules/common/upload-image/upload-image.component';
import { DialogUpdateStatusComponent } from 'app/modules/common/dialog-update-status/dialog-update-status.component';
import { DialogViewImageComponent } from 'app/modules/common/dialog-view-image/dialog-view-image.component';

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
import { TimeLineComponent } from 'app/modules/shared/time-line/time-line.component';
import { environment } from 'environments/environment';
import { DialogPoBoxComponent } from '../dialog-po-box/dialog-po-box.component';
import { PictureComponent } from 'app/modules/shared/picture/picture.component';

@Component({
    selector: 'app-member-setting',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
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
        ProgressBarComponent,
        MatTabsModule,
        ProgressBarComponent,
        TimeLineComponent,
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
export class ViewComponent implements OnInit {
    countProduct: number = 0
    sumdashbord = {

        total_items: 100,
        categories: [
            { name: 'ประเภท A', boxes: 99, cbm: 100 },
            { name: 'ประเภท B', boxes: 99, cbm: 100 },
            { name: 'ประเภท C', boxes: 99, cbm: 100 },
            { name: 'ประเภท D', boxes: 99, cbm: 100 },
            { name: 'ประเภท CB', boxes: 99, cbm: 100 },
            { name: 'ประเภท CD', boxes: 99, cbm: 100 },
            { name: 'ประเภท CF', boxes: 99, cbm: 100 },
        ],
        summary: {
            total_orders: 1870,
            total_cbm: 1870,
            total_weight_kg: 1870,
            transport_truck: 1870,
            transport_ship: 1870,
        },
    };
    packingList: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    type: string;
    Id: number;
    data: any;
    lists = [];
    filteredDeliveryOrders: any[] = [];
    filteredDeliveryOrders2: any[] = [];
    images: any[] = [];
    Form: FormGroup;
    form: FormGroup;
    public chartOptions: Partial<ChartOptions> = {};
    selectedTabIndex: number = 0;

    timelineData = [
        {
            id: '01',
            text: this.translocoService.translate('common.dialog_update_status.status_options.warehouse'),
            value: 'received',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '02',
            text: this.translocoService.translate('common.dialog_update_status.status_options.pallet'),
            value: 'palletized',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '03',
            text: this.translocoService.translate('common.dialog_update_status.status_options.transit_china'),
            value: 'to_border',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '04',
            text: this.translocoService.translate('common.dialog_update_status.status_options.booking'),
            value: 'booked',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '05',
            text: this.translocoService.translate('common.dialog_update_status.status_options.close_container_china'),
            value: 'sealed',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '06',
            text: this.translocoService.translate('common.dialog_update_status.status_options.customs_china'),
            value: 'cn_customs',
            user: '',
            date: '',
            time: '',
            status: false,
            hasButton: true,
        },
        {
            id: '07',
            text: this.translocoService.translate('common.dialog_update_status.status_options.inspection_china'),
            value: 'cn_hold',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '08',
            text: this.translocoService.translate('common.dialog_update_status.status_options.transit_china_thailand'),
            value: 'departed_china',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '09',
            text: this.translocoService.translate('common.dialog_update_status.status_options.customs_thailand'),
            value: 'th_customs',
            user: '',
            date: '',
            time: '',
            status: false,
            hasButton: true,
        },
        {
            id: '10',
            text: this.translocoService.translate('common.dialog_update_status.status_options.warehouse_arrival'),
            value: 'arrived_thailand',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '11',
            text: this.translocoService.translate('common.dialog_update_status.status_options.customer_arrival'),
            value: 'delivering',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '12',
            text: this.translocoService.translate('common.dialog_update_status.status_options.customer_received'),
            value: 'delivered',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '13',
            text: this.translocoService.translate('common.dialog_update_status.status_options.close_container_thai'),
            value: 'closed',
            user: '',
            date: '',
            time: '',
            status: false,
        },
    ];

    store: any[] = []
    dashboard_data: any;
    langues: any;
    product_types: any[] = []
    lang_type = {
        type_a: { th: 'ประเภท A', en: 'Type A', cn: 'A型' },
        type_b: { th: 'ประเภท B', en: 'Type B', cn: 'B型' },
        type_c: { th: 'ประเภท C', en: 'Type C', cn: 'C型' },
        type_d: { th: 'ประเภท D', en: 'Type D', cn: 'D型' },
        type_cb: { th: 'ประเภท CB', en: 'Type CB', cn: 'CB型' },
        type_cd: { th: 'ประเภท CD', en: 'Type CD', cn: 'CD型' },
        type_cf: { th: 'ประเภท CF', en: 'Type CF', cn: 'CF型' },
    };
    allItem: any;
    constructor(
        private translocoService: TranslocoService,
        private FormBuilder: FormBuilder,
        public _service: LotService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        public dialog: MatDialog
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;

        this._service.getProductType().subscribe((resp: any) => {
            this.product_types = resp.data
        })
        this._service.getStore().subscribe((resp: any) => {
            this.store = resp.data

        })

        this.langues = localStorage.getItem('lang');
    }
    ngOnInit(): void {
        this.filterForm = this.FormBuilder.group({
            member_id: [''],
            po_no: [''],
            in_store: [''],
            start_date: [''],
            end_date: [''],
            shipment_by: [''],
            type: ['']
        });

        this.form = this.FormBuilder.group({
            packing_list_images: this.FormBuilder.array([])
        });
        this.getById()
        this.filterForm
            .get('in_store')
            .valueChanges.pipe(debounceTime(500))
            .subscribe((value) => {
                if (this.filterForm.get('in_store').value !== null) {
                    this.filteredDeliveryOrders =
                        this.data?.packling_list_order_lists.filter((order) =>
                            order.delivery_order.code.includes(value)
                        );
                }
            });


    }

    getById() {
        this._service.get(this.Id).subscribe((resp: any) => {
            this.data = resp.data
            console.log('✅ Data จาก API:', this.data);

            this.countProduct = this.data?.packing_list_order_lists?.reduce((sum: number, item: any) => {
                return sum + (Number(item.delivery_order_list.qty_box) || 0);
                    }, 0);

            this.form = this.FormBuilder.group({
                packing_list_images: this.FormBuilder.array(this.data.packing_list_images.map(item =>
                    this.FormBuilder.group({
                        id: [item.id],
                        IsChecked: [false]
                    })
                ))
            });
            this.allItem = this.data?.delivery_order_list_items.length;
            this.images = this.data.packing_list_images
            this.filteredDeliveryOrders = this.data?.packing_list_order_lists.map((item: any) => {
                const long = Number(item.delivery_order_list.long);
                const width = Number(item.delivery_order_list.width);
                const height = Number(item.delivery_order_list.height);
                const weight = Number(item.delivery_order_list.weight);
                const qty = Number(item.delivery_order_list.qty_box);
                const cbmPerUnit = (long * width * height) / 1000000;
                const totalCBM = cbmPerUnit * qty;
                const totalWeight = weight * qty;
                const statusCounts = {
                    total: 0,
                    in: 0,
                    wait: 0,
                    out: 0
                };

                return {
                    ...item,
                    cbmPerUnit: cbmPerUnit.toFixed(4),
                    totalCBM: totalCBM.toFixed(4),
                    totalWeight: totalWeight.toFixed(2)
                };
            });

        })

        this._service.getDashboardById(this.Id).subscribe((resp: any) => {
            this.dashboard_data = resp.data
            if (this.dashboard_data) {
                this.sumdashbord.total_items = this.dashboard_data?.total_items;
                this.sumdashbord.summary.total_cbm = this.dashboard_data?.cbm_total;
                this.sumdashbord.summary.total_weight_kg = this.dashboard_data?.weight_total_kg;
                this.sumdashbord.summary.transport_truck = this.dashboard_data?.road_transport;
                this.sumdashbord.summary.transport_ship = this.dashboard_data?.sea_transport;
                this.sumdashbord.categories = this.dashboard_data?.categories.map((cat) => {
                        const typeKey = Object.entries(this.lang_type).find(
                            ([key, value]) =>
                                value.th === cat?.type ||
                                value.en === cat?.type ||
                                value.cn === cat?.type
                        )?.[0];

                        return {
                            name: typeKey
                                ? this.lang_type[typeKey][this.langues]
                                : cat.type, // ใช้ชื่อภาษาที่เลือก หรือค่าดั้งเดิมถ้าไม่พบ
                            boxes: cat.boxes,
                            cbm: cat.cbm,
                        };
                    });
                this.chartOptions = {
                    n_series: this.sumdashbord?.categories.map((cat) => cat.cbm),
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

        this.countProduct = this.data?.packling_list_order_lists?.reduce((sum: number, item: any) => {
            return sum + (Number(item.delivery_order_list.qty_box) || 0);
        }, 0);
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

    shipmentMethods = [
  { value: 'Car', label: 'ขนส่งทางรถ' },
  { value: 'Ship', label: 'ขนส่งทางเรือ' },
  { value: 'Train', label: 'ขนส่งทางรถไฟ' },
];

    Close() {
        this._router.navigate(['pallet']);
    }

    filterForm: FormGroup;
    showFilterForm: boolean = false;

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
        this.filteredDeliveryOrders = this.data?.packing_list_order_lists;


    }

    applyFilter() {
    const { po_no, shipment_by, type } = this.filterForm.value;

    if (!Array.isArray(this.data?.packing_list_order_lists)) {
        console.warn('❌ packing_list_order_lists ไม่พร้อมใช้งาน');
        this.filteredDeliveryOrders = [];
        return;
    }

    this.filteredDeliveryOrders = this.data.packing_list_order_lists.filter(order => {
        const po = order.delivery_order?.po_no;
        const ship = order.delivery_order?.shipment_by;
        const productTypeId = order.delivery_order_list?.product_type_id;
        const productTypeLabel = this.convertProductType(productTypeId)?.toLowerCase();

        const poNoMatch = !po_no || po?.toLowerCase().includes(po_no.toLowerCase());
        const shipmentMatch = !shipment_by || ship?.toLowerCase().includes(shipment_by.toLowerCase());
        const typeMatch = !type || productTypeLabel?.includes(type.toLowerCase());

        return poNoMatch && shipmentMatch && typeMatch;
  });
}

    clearFilter() {
        this.filterForm.reset();
        this.filteredDeliveryOrders = this.data?.packing_list_order_lists;
    }
    selectMember(event: any) {
        this.filterForm.patchValue({
            member_id: event.id,
        });
    }
    opendialogdelete() {
        console.log(this.form.value);

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
                const selectedIds = this.listArray.controls
                    .filter(ctrl => ctrl.get('IsChecked')?.value)
                    .map(ctrl => ctrl.get('id')?.value);
                this._service.deleteImage(selectedIds).subscribe({
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
    opendialogphoto() {
        const DialogRef = this.dialog.open(UploadImageComponent, {
            disableClose: true,
            width: '60%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                title: 'เพิ่มรูปสินค้า',
                id: this.Id
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {

                this._service.get(this.Id).subscribe((resp: any) => {
                    console.log(resp.data, 'data');

                })
            }
        });
    }
    opendialogqrcode() {
        const DialogRef = this.dialog.open(DialogQRCodeComponent, {
            disableClose: true,
            width: '400px',
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
        return this.data?.delivery_orders.length;
    }
    get totalWeight() {
        return this.data?.delivery_orders
            .reduce(
                (total, item) =>
                    total +
                    (isNaN(Number(item.weight)) ? 0 : Number(item.weight)),
                0
            )
            .toFixed(2);
    }
    get totalCBM() {
        return this.data?.delivery_orders
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

    get listArray(): FormArray {
        return this.form.get('packing_list_images') as FormArray;
    }

    updateAllselect() {
        this.selectAll = this.lists != null && this.lists.every((t) => t.IsChecked);
        const listArray = this.listArray;

        this.lists.forEach((item, index) => {
            const formGroup = listArray.at(index) as FormGroup;

            // กำหนดค่า IsChecked และ id ลงไปในแต่ละ group
            formGroup.patchValue({
                IsChecked: item.IsChecked,
                id: item.id // ใส่ id ด้วย
            });
        });
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

    onTabChange(event: any): void {
        this.selectedTabIndex = event.index;
    }

    opendialogstatus() {
        const DialogRef = this.dialog.open(DialogUpdateStatusComponent, {
            disableClose: true,
            width: '500px',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                text: this.data?.code,
                status: this.data
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const body = {
                    status: result.status,
                    image: null,
                    packing_lists: [this.Id],
                }

                this._service.updateStatusPackingList(body).subscribe({
                    next: (resp: any) => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.success')
                        );

                        this.data = null;

                        this.ngOnInit();
                    },
                    error: (err) => {
                        this.toastr.error(
                            this.translocoService.translate('toastr.error')
                        );
                    },
                });
            }
        });
    }

    convertProductType(data: any) {
        const productType = this.product_types.find(
            (type) => type.id === data
        );
        return productType ? productType.name : '';
    }

    convertStore(data: any) {
        const item = this.store.find(
            (store) => store.id === data
        );
        return item ? item.name : '';
    }

    calculateCBMAndWeight(item: any) {
        const long = Number(item.long);
        const width = Number(item.width);
        const height = Number(item.height);
        const weight = Number(item.weight);
        const qty = item.qty_box;

        const cbmPerUnit = (long * width * height) / 1000000; // cm³ → m³
        const totalCBM = cbmPerUnit * qty;
        const totalWeight = weight * qty;

        return {
            cbmPerUnit: cbmPerUnit.toFixed(4),   // ทศนิยม 6 ตำแหน่ง
            totalCBM: totalCBM.toFixed(4),
            totalWeight: totalWeight.toFixed(2)  // ทศนิยม 2 ตำแหน่ง
        };
    }

    convertPathImage(url: any) {
        return environment.apiUrl + '/' + url
    }

    openPoBox(data: any) {
        const enrichedData = {
            ...data,
            packing_list_id: this.Id
        };
        const DialogRef = this.dialog.open(DialogPoBoxComponent, {
            disableClose: true,
            width: '80%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: enrichedData
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getById()
            }
        });
    }

    getPackingNo(packingId: any) {
        const packing = this.packingList.find((item: any) => item.id === packingId);
        return packing || null;
    }
    countInStatus(): number {
        return this.data?.delivery_order_list?.delivery_order_list_items?.filter(
            (item: any) => item.status === 'in'
        ).length || 0;
    }

    showPicture(imgObject: string): void {

        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
                width: '90vw',
                height: '90vh',
                panelClass: 'custom-dialog-container',
                disableClose: true
            })
            .afterClosed()
            .subscribe(() => {

            });
    }

    CountInChina(data: any) {
        return data?.delivery_order_list?.delivery_order_list_items?.filter(
            (item: any) => item.status === 'in'
        ).length || 0;
    }


    countFilteredItems(items: any[]): number {
        return items.filter(item =>
            item.packing_list_id === +this.Id && item.status === 'in'
        ).length;
    }


}





