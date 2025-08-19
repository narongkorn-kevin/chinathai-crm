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
import { debounceTime, distinctUntilChanged, map, merge, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { ProductComposeComponent } from '../product/dialog/product-compose/product-compose.component';
import { DialogForm } from './form-dialog/dialog.component';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ViewComponent } from './view/view.component';
import { DialogStatus } from './status-dialog/dialog.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ExportService } from 'app/modules/shared/export.service';
import { DialogUpdatePaymentComponent } from './dialog-update-payment/dialog-update-payment.component';
import { PictureComponent } from 'app/modules/shared/picture/picture.component';
import { DateTime } from 'luxon';
import { AlipayService } from './alipay.service';

@Component({
    selector: 'app-alipay',
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
    templateUrl: './alipay.component.html',
    styleUrl: './alipay.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AlipayComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dataRow: any[] = [];
    filteredDataRow: any[] = [];

    filterForm: FormGroup;
    showFilterForm: boolean = false;
    @ViewChild('pic') pic: any;
    @ViewChild('picSlip') pic_url: any;
    @ViewChild('picQr') pic_qr: any;
    @ViewChild('status') status: any;
    @ViewChild('btNg') btNg: any;
    @ViewChild('option') option: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    @ViewChild('tableElement') tableElement!: ElementRef;
    constructor(
        private translocoService: TranslocoService,
        private _service: AlipayService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private currencyPipe: CurrencyPipe,
        private _router: Router,
        private _fb: FormBuilder,
        private exportService: ExportService
    ) {
        this.filterForm = this._fb.group({
            fname: [''],
            start_date: [''],
            end_date: [''],
            code: [''],
            phone: [''],
            status: ['']
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

        setTimeout(() => this.loadTable());

        this.filterForm
        .get('code')
        ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(() => {
        this.rerender();
        });

        this.filterForm
        .get('fname')
        ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(() => {
        this.rerender();
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

    onChangeType() {
        this.rerender();
    }

    rows: any[] = [];

    loadTable(): void {
        const menuTitles = {
            operation: {
                th: 'ดำเนินการ',
                en: 'Operation',
                cn: '操作',
            },
            alipay_code: {
                th: 'รหัสเติม ALiPAY',
                en: 'ALiPAY Top-up Code',
                cn: '支付宝充值码',
            },
            customer: {
                th: 'ลูกค้า',
                en: 'Customer',
                cn: '客户',
            },
            amount_due: {
                th: 'ยอดที่ต้องชำระ',
                en: 'Amount Due',
                cn: '应付金额',
            },
            transfer_amount: {
                th: 'ยอดโอน',
                en: 'Transfer Amount',
                cn: '转账金额',
            },
            transfer_evidence: {
                th: 'หลักฐานการโอน',
                en: 'Transfer Evidence',
                cn: '转账凭证',
            },
            payment_datetime: {
                th: 'วันเวลาที่ชำระเงิน',
                en: 'Payment Date/Time',
                cn: '付款日期/时间',
            },
            remark: {
                th: 'หมายเหตุ',
                en: 'Remark',
                cn: '备注',
            },
            alipay_qrcode: {
                th: 'QR code เติม ALiPAY',
                en: 'ALiPAY Top-up QR Code',
                cn: '支付宝充值二维码',
            },
            alipay_evidence: {
                th: 'หลักฐานการเติม AILPAY',
                en: 'ALiPAY Top-up Evidence',
                cn: '支付宝充值凭证',
            },
            status: {
                th: 'สถานะ',
                en: 'Status',
                cn: '状态',
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
                if (this.filterForm.value.code) {
                    dataTablesParameters.code = this.filterForm.value.code;
                }
                if (this.filterForm.value.start_date && this.filterForm.value.end_date) {
                    const start_date: DateTime = this.filterForm.value.start_date;
                    const end_date: DateTime = this.filterForm.value.end_date;
                                                                
                    dataTablesParameters.created_at = start_date.toFormat('yyyy-MM-dd');
                    dataTablesParameters.end_date = end_date.toFormat('yyyy-MM-dd');
                }
                if (this.filterForm.value.fname) {
                    dataTablesParameters.fname = this.filterForm.value.fname;
                }
                if (this.filterForm.value.status) {
                    dataTablesParameters.status = this.filterForm.value.status;
                }

                const startDate = this.filterForm.value.start_date;
                const endDate = this.filterForm.value.end_date;

                if (startDate) {
                    // แปลงเป็น string format ที่ backend รู้จัก เช่น 'YYYY-MM-DD'
                    dataTablesParameters.transfer_at = this.formatDate(startDate);
                }
                if (endDate) {
                    dataTablesParameters.end_date = this.formatDate(endDate);
                }   
                this._service
                    .datatable(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            console.log('resp', resp);
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
                    title: '#',
                    data: 'No',
                    className: 'w-5 text-center',
                },
                {
                    title: menuTitles.operation[this.langues],
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.option,
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.alipay_code[this.langues],
                    data: 'code',
                    defaultContent: '',
                    className: '',
                },
                {
                    title: menuTitles.customer[this.langues],
                    data: 'fullname',
                    defaultContent: '-',
                    className: '',
                },
                {
                    title: menuTitles.amount_due[this.langues],
                    data: 'total',
                    defaultContent: '',
                    className: 'text-right', // เพิ่ม class จัดตำแหน่งถ้าต้องการ
                    render: function (data, type, row) {
                        const value = parseFloat(data);
                        return isNaN(value) ? '0.00' : value.toFixed(2);
                    }
                },
                {
                    title: menuTitles.transfer_amount[this.langues],
                    data: 'amount',
                    defaultContent: '',
                    className: 'text-right',
                    render: function (data, type, row) {
                        const value = parseFloat(data);
                        return isNaN(value) ? '0.00' : value.toFixed(2);
                    }
                },
                {
                    title: menuTitles.transfer_evidence[this.langues],
                    data: null,
                    defaultContent: '',
                    className: '',
                    ngTemplateRef: {
                        ref: this.pic,
                    },
                },
                {
                    title: menuTitles.payment_datetime[this.langues],
                    data: 'transfer_at',
                    defaultContent: '',
                    className: '',
                },
                {
                    title: menuTitles.remark[this.langues],
                    data: 'note',
                    defaultContent: '-',
                    className: '',
                },
                // {
                //     title: menuTitles.alipay_qrcode[this.langues],
                //     data: null,
                //     defaultContent: '',
                //     className: '',
                //     ngTemplateRef: {
                //         ref: this.pic_qr
                //     },
                // },
                // {
                //     title: menuTitles.alipay_evidence[this.langues],
                //     data: null,
                //     defaultContent: '',
                //     ngTemplateRef: {
                //         ref: this.pic_url,
                //     },
                // },
                {
                    title: menuTitles.status[this.langues],
                    data: 'status',
                    defaultContent: '-',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.status,
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
        setTimeout(() => {
            this.dtElement?.dtInstance?.then((dtInstance: DataTables.Api) => {
            const el = this.tableElement?.nativeElement;
            if (!el || !document.body.contains(el)) {
                console.warn('Table element is not in the document. Skip destroy.');
                return;
            }

            dtInstance.destroy();
            this.dtTrigger.next(this.dtOptions);
            });
        }, 0); // ให้ DOM มีโอกาส update ก่อน
    }

    openDialogview(data: any) {
        console.log('data', data);

        const DialogRef = this.dialog.open(DialogUpdatePaymentComponent, {
            disableClose: true,
            width: '600px',
            height: 'auto',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                value: data,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    openDialogviewQR(data: any) {
        console.log('data', data);

        const DialogRef = this.dialog.open(ViewComponent, {
            disableClose: true,
            width: '600px',
            height: 'auto',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'QR',
                value: data,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    openDialogStatus(data: any) {
        const DialogRef = this.dialog.open(DialogStatus, {
            disableClose: true,
            width: '600px',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                value: data,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    openDialogForm() {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '600px',
            height: 'auto',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW'
            },
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
                'confirmation.delete_member'
            ),
            message: this.translocoService.translate(
                'confirmation.delete_membermessage'
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

    formatDate(date: any): string {
        // ถ้า date เป็น Date object หรือ moment ให้แปลงเป็น string "YYYY-MM-DD"
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
    }

    applyFilter() {
    const filter = this.filterForm.value;
    if (!this.dataRow) return;

    if (!filter.start_date) {
        // ถ้าไม่เลือกวัน ก็แสดงข้อมูลทั้งหมด
        this.filteredDataRow = this.dataRow;
    } else {
        const start = new Date(filter.start_date);
        const startOfDay = new Date(start.setHours(0, 0, 0, 0)).getTime();
        const endOfDay = new Date(start.setHours(23, 59, 59, 999)).getTime();

        this.filteredDataRow = this.dataRow.filter((item: any) => {
            const createdAt = new Date(item.transfer_at).getTime();
            return createdAt >= startOfDay && createdAt <= endOfDay;
        });
    }

    // แสดงข้อมูล filteredDataRow ในตารางแทนข้อมูลเดิม
    this.dataRow = this.filteredDataRow;
    this.rerender();
}

    clearFilter() {
        this.filterForm.reset();
        this.rerender();
    }

    exportData(type: 'csv' | 'excel' | 'print' | 'copy') {
        this.exportService.exportTable(this.tableElement, type);
    }

    imageLoadedMap: { [key: string]: boolean } = {};

    onImageError(url: string) {
        this.imageLoadedMap[url] = false;
    }

    onImageLoad(url: string) {
        this.imageLoadedMap[url] = true;
    }

    // เพิ่มฟังก์ชันตรวจสอบสถานะ (optional)
    isImageLoaded(url: string): boolean {
        return this.imageLoadedMap[url] !== false;
    }

    isImageFile(url: string | null | undefined): boolean {
        if (typeof url !== 'string' || !url.trim()) return false;
        return /\.(jpe?g|png|gif|bmp|webp)$/i.test(url);
      }
      
      getFileNameFromUrl(url: string | null | undefined): string {
        if (typeof url !== 'string' || !url.trim()) return 'download';
        return url.split('/').pop() || 'download';
      }

}
