import { data } from 'jquery';
import {
    CommonModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
} from '@angular/common';
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
import { forkJoin, map, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { InvoiceService } from './invoice.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CdkMenuModule } from '@angular/cdk/menu';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { DialogViewImageComponent } from 'app/modules/common/dialog-view-image/dialog-view-image.component';
import { DialogSavePaymentComponent } from './dialog-save-payment/dialog-save-payment.component';
import { DialogStatusComponent } from './dialog-status/dialog-status.component';
import { ImageViewerComponent } from 'app/modules/common/image-viewer/image-viewer.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ExportService } from 'app/modules/shared/export.service';

@Component({
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        CdkMenuModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatCheckboxModule,
        RouterLink
    ],
    templateUrl: './invoice.component.html',
    styleUrl: './invoice.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [CurrencyPipe, DecimalPipe, DatePipe],
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
export class InvoiceComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild('btNg') btNg: any;
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('option') option: any;
    @ViewChild('view') view: any;
    @ViewChild('status') status: any;
    @ViewChild('pic') pic: any;
    @ViewChild('total') total: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    showAdvancedFilters: boolean = false;
    showFilters: boolean = true;
    dataRow: any[] = [];
    rows: any[] = [];
    transports = [];

    filterForm: FormGroup;
    showFilterForm: boolean = false;
    @ViewChild('tableElement') tableElement!: ElementRef;
    constructor(
        private translocoService: TranslocoService,
        private http: HttpClient,
        private _service: InvoiceService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _router: Router,
        private FormBuilder: FormBuilder,
        private activated: ActivatedRoute,
        private datePipe: DatePipe,
        private exportService: ExportService
    ) {
        this.transports = this.activated.snapshot.data.transports?.data;

        this.filterForm = this.FormBuilder.group({
            date: [''],
            start_date: [''],
            end_date: [''],
            code: [''],
            shipment: [''],
            standard_size_id: [''],
            category_product: [''],
        });
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
    }
    loadTable(): void {
        const menuTitles = {
            options: {
                th: 'ตัวเลือก',
                en: 'Options',
                cn: '选项',
            },
            date: {
                th: 'วันที่',
                en: 'Date',
                cn: '日期',
            },
            invoice_code: {
                th: 'รหัสใบแจ้งหนี้',
                en: 'Invoice Code',
                cn: '发票编号',
            },
            packing_list: {
                th: 'Packing list',
                en: 'Packing List',
                cn: '装箱单',
            },
            shipping_by: {
                th: 'ขนส่งโดย',
                en: 'Shipped By',
                cn: '运输方式',
            },
            customer: {
                th: 'ลูกค้า',
                en: 'Customer',
                cn: '客户',
            },
            address: {
                th: 'ที่อยู่',
                en: 'Address',
                cn: '地址',
            },
            credit: {
                th: 'เครดิต',
                en: 'Credit',
                cn: '信用额度',
            },
            domestic_shipping_fee: {
                th: 'ค่าขนส่งในไทย',
                en: 'Domestic Shipping Fee',
                cn: '国内运费',
            },
            china_service_fee: {
                th: 'คิดค่าบริการจีน + ตีลัง',
                en: 'China Service Fee + Handling',
                cn: '中国服务费+搬运费',
            },
            china_service_fee_y: {
                th: 'คิดค่าบริการจีน(Y)',
                en: 'China Service Fee (Y)',
                cn: '中国服务费(元)',
            },
            exchange_rate_y: {
                th: 'อัตตราแลกเปลี่ยน(Y)',
                en: 'Exchange Rate (Y)',
                cn: '汇率(元)',
            },
            handling_fee_y: {
                th: 'ค่าตีลัง(Y)',
                en: 'Handling Fee (Y)',
                cn: '搬运费(元)',
            },
            china_service_fee_thb: {
                th: 'คิดค่าบริการจีน + ตีลัง(฿)',
                en: 'China Service Fee + Handling (฿)',
                cn: '中国服务费+搬运费(泰铢)',
            },
            total_charge: {
                th: 'ยอดเรียกเก็บ',
                en: 'Total Charge',
                cn: '总费用',
            },
            status: {
                th: 'สถานะ',
                en: 'Status',
                cn: '状态',
            },
            payment_evidence: {
                th: 'รูปหลักฐานการชำระ',
                en: 'Payment Evidence',
                cn: '付款凭证',
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
                this._service
                    .datatable(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            console.log('API Response:', resp);
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
                    title: menuTitles.options[this.langues],
                    data: null,
                    ngTemplateRef: {
                        ref: this.option,
                    },
                    className: 'text-center',
                },
                {
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                },
                {
                    title: menuTitles.date[this.langues],
                    data: 'in_thai_date',
                    className: 'text-center',
                    render: (data: string) => {
                        return this.datePipe.transform(data, 'yyyy-MM-dd');
                    },
                },
                {
                    title: menuTitles.invoice_code[this.langues],
                    data: 'code',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.view,
                    },
                },
                {
                    title: menuTitles.packing_list[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.shipping_by[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.customer[this.langues],
                    data: function (row: any) {
                        return row.member?.importer_code ?? '-'
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.address[this.langues],
                    data: function (row: any) {
                        return (
                            (row.member_address?.sub_district ?? '') +
                            ' ' +
                            (row.member_address?.district ?? '') +
                            ' ' +
                            (row.member_address?.province ?? '') +
                            ' ' +
                            (row.member_address?.address ?? '') +
                            ' ' +
                            (row.member_address?.postal_code ?? '')
                        );
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.credit[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.domestic_shipping_fee[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.china_service_fee[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.china_service_fee_y[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.exchange_rate_y[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.handling_fee_y[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.china_service_fee_thb[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.total_charge[this.langues],
                    data: null,
                    className: 'text-right',
                    ngTemplateRef: {
                        ref: this.total,
                    },
                    defaultContent: '0.00',
                },
                {
                    title: menuTitles.status[this.langues],
                    data: 'status',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.status,
                    },
                },
                {
                    title: menuTitles.payment_evidence[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.pic,
                    },
                },
            ],
            // Declare the use of the extension in the dom parameter
            dom: 'lfrtip',
            buttons: [
                {
                    extend: 'copy',
                    className: 'btn-csv-hidden'
                },
                {
                    extend: 'csv',
                    className: 'btn-csv-hidden'
                },
                {
                    extend: 'excel',
                    className: 'btn-csv-hidden'
                },
                {
                    extend: 'print',
                    className: 'btn-csv-hidden'
                },
            ]
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

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }

    goToPalletForm() {
        this._router.navigate(['/pallet-form']);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
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
            //                 this.rerender();
            //             },
            //             complete: () => {
            //                 if (i == id.length - 1) {
            //                     this.multiSelect = [];
            //                     this.toastr.success(this.translocoService.translate('toastr.delete'));
            //                     this.rerender();
            //                 }
            //             },
            //         });
            //     }
            //     if (id.length === 1) {
            //         this.rerender();
            //     }
            // }
            if (result == 'confirmed') {
                const id = this.multiSelect;
                console.log(id, 'id');

                const deleteRequests = id.map((itemId) =>
                    this._service.delete(itemId)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.delete')
                        );
                        this.multiSelect = [];
                        this.rerender();
                    },
                    error: (err) => {
                        this.toastr.error(
                            'ลบรายการสมาชิก ล้มเหลว โปรดลองใหม่อีกครั้งภายหลัง'
                        );
                        console.log(err, 'err');
                        this.rerender();
                    },
                });
            }
        });
    }

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

    opendialogsavepayment(data: any) {
        const DialogRef = this.dialog.open(DialogSavePaymentComponent, {
            disableClose: true,
            width: '60%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: data,
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }
    opendialogstatus(data: any) {
        console.log(data, 'data');

        const DialogRef = this.dialog.open(DialogStatusComponent, {
            disableClose: true,
            width: '500px',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: data,
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    add() {
        this._router.navigate(['/invoice/form']);
    }

    openImageViewer(imageUrl: string): void {
        this.dialog.open(ImageViewerComponent, {
            width: '80%',
            height: '80%',
            maxWidth: '100vw',
            maxHeight: '100vh',
            data: {
                imageUrl: imageUrl,
            },
        });
    }

    exportData(type: 'csv' | 'excel' | 'print' | 'copy') {
        this.exportService.exportTable(this.tableElement, type);
    }

    calculateTotalCharge(data: any): string {
        const totalCharge = (Number(data.total_amount) || 0) + (Number(data.total_vat) || 0);
        return totalCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

}
