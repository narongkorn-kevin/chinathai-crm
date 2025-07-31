import { CdkMenuModule } from '@angular/cdk/menu';
import { forkJoin, Subscription } from 'rxjs';
import {
    Component,
    OnInit,
    OnChanges,
    Inject,
    ChangeDetectorRef,
} from '@angular/core';
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
import { DialogPoComponent } from '../dialog-po/dialog-po.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogViewImageComponent } from 'app/modules/common/dialog-view-image/dialog-view-image.component';
import { DialogUpdateStatusComponent } from 'app/modules/common/dialog-update-status/dialog-update-status.component';

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
import { ScanBarcodeComponent } from 'app/modules/shared/scan-barcode.component';

@Component({
    selector: 'app-member-scan',
    standalone: true,
    templateUrl: './scan.component.html',
    styleUrl: './scan.component.scss',
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
        MatTabsModule,
        ScanBarcodeComponent,
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
export class ScanComponent implements OnInit {
    errorAudio = new Audio('assets/sound/error.mp3');
    allItem: any;
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
    lang_type = {
        type_a: { th: 'ประเภท A', en: 'Type A', cn: 'A型' },
        type_b: { th: 'ประเภท B', en: 'Type B', cn: 'B型' },
        type_c: { th: 'ประเภท C', en: 'Type C', cn: 'C型' },
        type_d: { th: 'ประเภท D', en: 'Type D', cn: 'D型' },
        type_cb: { th: 'ประเภท CB', en: 'Type CB', cn: 'CB型' },
        type_cd: { th: 'ประเภท CD', en: 'Type CD', cn: 'CD型' },
        type_cf: { th: 'ประเภท CF', en: 'Type CF', cn: 'CF型' },
    };
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    type: string;
    Id: number;
    data: any;
    lists = [];
    filteredDeliveryOrders: any[] = [];
    Form: FormGroup;
    public chartOptions: Partial<ChartOptions> = {};

    timelineData = [
        {
            id: '01',
            text: 'รับเข้าคลัง',
            user: 'testcargo',
            date: '2024-08-10',
            time: '01:35',
            status: true,
        },
        {
            id: '02',
            text: 'ขึ้นพาเลท',
            user: 'testcargo',
            date: '2024-08-10',
            time: '01:35',
            status: true,
        },
        {
            id: '03',
            text: 'พัสดุเดินทางจากโกดังจีนไปหน้าด่าน',
            user: 'testcargo',
            date: '2024-08-10',
            time: '01:35',
            status: true,
        },
        {
            id: '04',
            text: 'จองตู้',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '05',
            text: 'ปิดตู้',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '06',
            text: 'ดำเนินพิธีศุลกากรต้นทางจีน',
            user: '',
            date: '',
            time: '',
            status: false,
            hasButton: true,
        },
        {
            id: '07',
            text: 'ติดตรวจปล่อยพิธีศุลกากรต้นทางจีน',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '08',
            text: 'พัสดุเดินทางระหว่าง จีน-ไทย',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '09',
            text: 'ดำเนินพิธีศุลกากรปลายทางไทย',
            user: '',
            date: '',
            time: '',
            status: false,
            hasButton: true,
        },
        {
            id: '10',
            text: 'พัสดุถึงโกดัง',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '11',
            text: 'พัสดุถึงลูกค้าปลายทาง',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '12',
            text: 'พัสดุถึงลูกค้าปลายทางเรียบร้อย',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '13',
            text: 'ปิดตู้',
            user: '',
            date: '',
            time: '',
            status: false,
        },
    ];
    dashboard_data: any;
    showScanbarCode: boolean = false;
    langues: string = ''
    constructor(
        private translocoService: TranslocoService,
        private FormBuilder: FormBuilder,
        public _service: LotService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data.data?.data;
        this.langues = localStorage.getItem('lang');
    }
    ngOnInit(): void {
        this.filterForm = this.FormBuilder.group({
            member_id: [''],
            in_store: [''],
            code: [''],
            sack_code: [''],
            pallet_code: [''],
        });

        if (this.Id) {
            this.getById()
            this.getDashboard()
        }

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

    Close() {
        this._router.navigate(['lot']);
    }

    filterForm: FormGroup;
    showFilterForm: boolean = false;

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
        this.filteredDeliveryOrders = this.data.packling_list_order_lists;
    }

    applyFilter() {
        const { code, member_id, sack_code } = this.filterForm.value;
        this.filteredDeliveryOrders =
            this.data.packling_list_order_lists.filter((order) => {
                return (
                    (!code ||
                        order.packling_list_order_lists.code.includes(code)) &&
                    (!sack_code ||
                        order.packling_list_order_lists.sack_code.includes(
                            sack_code
                        ))
                );
            });
    }

    clearFilter() {
        this.filterForm.reset();
        this.filteredDeliveryOrders = this.data.packling_list_order_lists;
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
    opendialogpo() {
        const DialogRef = this.dialog.open(DialogPoComponent, {
            disableClose: true,
            width: '80%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                Id: this.Id,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.getById();
                this.getDashboard();
                
            }
        });
    }
    fetchDataById(id: number): void {
        this._service.get(id).subscribe((resp: any) => {
            this.data = resp.data;
            this.filteredDeliveryOrders = this.data.packling_list_order_lists;
            this._changeDetectorRef.detectChanges();
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
            }
        });
    }
    get totallist() {
        return this.filteredDeliveryOrders?.length ?? 0;
    }

    get totalWeight() {
        return (
            this.filteredDeliveryOrders?.reduce((total, item) => {
                if (!item || item.totalWeight == null) return total;
                const weight = Number(item.totalWeight);
                return total + (isNaN(weight) ? 0 : weight);
            }, 0) ?? 0
        ).toFixed(4);
    }

    get totalCBM() {
        return (
            this.filteredDeliveryOrders?.reduce((total, item) => {
                if (!item || item.totalCBM == null) return total;
                const cbm = Number(item.totalCBM);
                return total + (isNaN(cbm) ? 0 : cbm);
            }, 0) ?? 0
        ).toFixed(4);
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

    selectedTabIndex: number = 0;

    onTabChange(event: any): void {
        this.selectedTabIndex = event.index;
    }
    opendialogviewimage() {
        const DialogRef = this.dialog.open(DialogViewImageComponent, {
            disableClose: true,
            width: '500px',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                images: [
                    {
                        file: null,
                        name: 'Image 1',
                        size: 1234,
                        imagePreview: 'https://picsum.photos/500/300?random=1',
                    },
                    {
                        file: null,
                        name: 'Image 2',
                        size: 1234,
                        imagePreview: 'https://picsum.photos/500/300?random=2',
                    },
                    {
                        file: null,
                        name: 'Image 3',
                        size: 1234,
                        imagePreview: 'https://picsum.photos/500/300?random=3',
                    },
                    {
                        file: null,
                        name: 'Image 4',
                        size: 1234,
                        imagePreview:
                            'https://cargo-api.dev-asha9.com/images/asset/08f78b444a30772fd597a7c23620ee9b.png',
                    },
                ],
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
            }
        });
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
                console.log(this.lists, 'lists');
            }
        });
    }

    codeScaned(value: string) {
        this.searchCode(value);
    }

    searchCode(code: string) {

        this.handleScanInput(code)
        return;

        const body = {
            columns: [],
            order: [{ column: 0, dir: 'asc' }],
            start: 0,
            length: 1,
            search: { value: code, regex: false },
        };

        this._service
            .datatablePoNonePackingListNew(body)
            .subscribe((resp: any) => {
                if (resp?.data?.data.length > 0) {
                    const data = resp.data.data[0];
                    // this.addOrder(data);

                    const formValue = {
                        packing_list_id: this.data.Id,
                        delivery_order_lists: [{
                            delivery_order_id: data.delivery_order_id,
                            delivery_order_list_id: data.delivery_order_list_id,
                            delivery_order_list_item_id: data.id,
                        }],
                    };
                    this._service.addOrder(formValue).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate('toastr.success')
                            );
                        },
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate(
                                    'toastr.error_occurred'
                                )
                            );
                            console.log(err);
                        },
                    });

                } else {
                    // this.toastr.error('Not Found');
                    // this.errorAudio.currentTime = 0;
                    // this.errorAudio.play().catch((e) => {
                    //     console.warn('Error sound failed to play', e);
                    // });
                    this.handleScanInput(code)
                }
            });
    }

    addOrder(data: any) {
        //check duplicate
        // if (
        //     this.filteredDeliveryOrders.find(
        //         (item) => item.barcode == data.barcode
        //     )
        // ) {
        //     console.log( this.filteredDeliveryOrders.find(
        //         (item) => item.barcode == data.barcode
        //     ));

        //     this.toastr.warning('Duplicate');
        //     this.errorAudio.currentTime = 0;
        //     this.errorAudio.play().catch((e) => {
        //         console.warn('Error sound failed to play', e);
        //     });
        //     return;
        // }
        data.delivery_order_lists.forEach(element => {
            this.filteredDeliveryOrders.push(element);
        });


    }

    showScanner() {
        this.showScanbarCode = !this.showScanbarCode;
    }

    handleScanInput(scanValue: string): void {
        const possibleKeys = ['pallet_code'];

        const tryNextKey = (index: number) => {
            if (index >= possibleKeys.length) {
                this.toastr.error('ไม่พบข้อมูล');
                this.errorAudio.currentTime = 0;
                this.errorAudio.play().catch(e => console.warn('Error sound failed to play', e));
                return;
            }
            const key = possibleKeys[index];
            const body = {
                draw: 1,
                columns: [
                    { data: null, name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                    { data: 'No', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                    { data: 'function', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                    { data: 'function', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                    { data: 'function', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                    { data: 'function', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                    { data: 'function', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                ],
                order: [{ column: 0, dir: 'asc' }],
                start: 0,
                length: 1000,
                search: { value: '', regex: false },
                [key]: scanValue, // ✅ แทรกค่าที่สแกนเข้าไปใน key ที่กำลังลอง

            };



            this._service.datatablePoNonePackingListNew(body).subscribe((resp: any) => {
                const dataList = resp?.data?.data || [];
                if (this.data.transport_by !== dataList[0].pallet?.shipped_by) {
                    this.toastr.error(
                        this.translocoService.translate(
                            'รูปแบบการขนส่งไม่ตรงกับ Packing List'
                        )
                    );
                    return;
                }
                if (dataList.length > 0) {

                    const delivery_order_lists = dataList.map(item => ({
                        delivery_order_id: item.delivery_order_id,
                        delivery_order_list_id: item.delivery_order_list_id,
                        delivery_order_list_item_id: item.id,
                        long: +item.delivery_order_list.long,
                        width: +item.delivery_order_list.width,
                        height: +item.delivery_order_list.height,
                        qty_box: +item.delivery_order_list.qty_box,
                    }));

                    const formSubmit = {
                        packing_list_id: this.Id,
                        delivery_order_lists: delivery_order_lists,
                    };

                    // this.addOrder(formSubmit)
                    this._service.addOrder(formSubmit).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate('toastr.success')
                            );
                            this.getById()
                            this.getDashboard()
                            this._changeDetectorRef.markForCheck()
                        },
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate(
                                    'toastr.error_occurred'
                                )
                            );
                            console.log(err);
                        },
                    });
                } else {
                    tryNextKey(index + 1); // ลอง key ถัดไป
                }
            });
        };

        tryNextKey(0);
    }

    getById() {
        this._service.get(this.Id).subscribe((resp: any) => {
            const delivery_order_list = resp.data.packing_list_order_lists;
            this.allItem = this.data?.delivery_order_list_items.length;
            this.filteredDeliveryOrders = resp.data.delivery_order_list_items.map(
                (item: any) => {
                    const detail = delivery_order_list.find(
                        (item) => item.delivery_order_id
                    );
                    if (detail) {
                        const long = Number(detail?.delivery_order_list.long);
                        const width = Number(detail?.delivery_order_list.width);
                        const height = Number(detail?.delivery_order_list.height);
                        const weight = Number(detail?.delivery_order_list.weight);
                        const qty = Number(detail?.delivery_order_list.qty_box);

                        const cbmPerUnit = (long * width * height) / 1000000;
                        const totalCBM = cbmPerUnit * 1;
                        const totalWeight = weight * 1;
                        return {
                            ...item,
                            cbmPerUnit: cbmPerUnit.toFixed(4),
                            totalCBM: totalCBM.toFixed(4),
                            totalWeight: totalWeight.toFixed(4),
                            selected: false
                        };
                    }
                }
            );

            this._changeDetectorRef.markForCheck()
        })


    }

    selectedItems: any[] = [];

    toggleAllSelection(checked: boolean): void {
        if (checked) {
            this.selectedItems = [...this.filteredDeliveryOrders];
        } else {
            this.selectedItems = [];
        }
    }

    toggleSelection(item: any, checked: boolean): void {
        if (checked) {
            this.selectedItems.push(item);
        } else {
            this.selectedItems = this.selectedItems.filter(i => i !== item);
        }
    }

    isAllSelected(): boolean {
        return (
            this.selectedItems.length === this.filteredDeliveryOrders.length &&
            this.filteredDeliveryOrders.length > 0
        );
    }

    isIndeterminate(): boolean {
        return (
            this.selectedItems.length > 0 &&
            this.selectedItems.length < this.filteredDeliveryOrders.length
        );
    }

    deleteSelected() {


        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate('confirmation.save_title'),
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'primary',
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
            if (result === 'confirmed') {
                const deleteObservables = this.selectedItems.map(item =>
                    this._service.deleteItemInPackinglist(item.id)
                );

                forkJoin(deleteObservables).subscribe({
                    next: () => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.success')
                        );
                        this.getById(); // เรียกหลังจากลบทุกอันเสร็จ
                        this.getDashboard(); // เรียกหลังจากลบทุกอันเสร็จ
                    },
                    error: () => {
                        this.toastr.error(
                            this.translocoService.translate('toastr.error_occurred')
                        );
                    }
                });
            }
        });
    }

    getDashboard() {
        this._service.getDashboardById(this.Id).subscribe((resp: any) => {
            this.dashboard_data = resp.data
            if (this.dashboard_data) {
                this.sumdashbord.total_items =
                    this.dashboard_data?.total_items;
                this.sumdashbord.summary.total_cbm =
                    this.dashboard_data?.cbm_total;
                this.sumdashbord.summary.total_weight_kg =
                    this.dashboard_data?.weight_total_kg;
                this.sumdashbord.summary.transport_truck =
                    this.dashboard_data?.road_transport;
                this.sumdashbord.summary.transport_ship =
                    this.dashboard_data?.sea_transport;
                this.sumdashbord.categories =
                    this.dashboard_data?.categories.map((cat) => {
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

    }

}
