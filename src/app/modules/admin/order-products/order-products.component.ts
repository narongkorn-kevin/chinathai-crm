import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { OrderProductsService } from './order-products.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogForm } from './form-dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogUpdatePaymentComponent } from '../dialog/dialog-update-payment/dialog-update-payment.component';
import { DialogUpdateStatusComponent } from '../dialog/dialog-update-status-order/dialog.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { DateTime } from 'luxon';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { PictureComponent } from 'app/modules/shared/picture/picture.component';
import { copyToClipboard } from 'app/modules/shared/helper';
import { ExportService } from 'app/modules/shared/export.service';
import { getPermissionName } from 'app/helper';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
@Component({
    selector: 'app-order-products',
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
        RouterLink,
        MatCheckboxModule,
        CdkMenuModule,
        SelectMemberComponent,
        MatTabsModule,
    ],
    templateUrl: './order-products.component.html',
    styleUrl: './order-products.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class OrderProductsComponent implements OnInit, AfterViewInit {

    orders: any[] = [];
    summary = {
        totalOrders: 0,
        totalMembers: 0,
        totalProducts: 0,
        totalPrice: 0,
        totalYuanValue: 0,
        statuses: {} as Record<string, number>,
    };


    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('btNg') btNg: any;
    @ViewChild('edit') edit: any;
    @ViewChild('status') status: any;
    @ViewChild('member') member: any;
    @ViewChild('pic') pic: any;
    @ViewChild('update') update: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    form: FormGroup;
    formData: FormGroup;
    filterForm: FormGroup;
    showFilterForm: boolean = false;
    dataRow: any[] = [];

    readonly baseStatusTabs: Array<{ value: string; labelKey: string }> = [
        { value: '', labelKey: 'order_products.order_status.all' },
        { value: 'awaiting_summary', labelKey: 'รอสรุปยอด' },
        { value: 'awaiting_payment', labelKey: 'รอชำระค่าสั่งซื้อ' },
        { value: 'in_progress', labelKey: 'รอตรวจสอบสลิป' },
        // { value: 'payment', labelKey: 'order_products.order_status.payment' },
        { value: 'confirm_payment', labelKey: 'ยืนยันการชำระเงิน' },
        { value: 'preparing_shipment', labelKey: 'สินค้าเตรียมจัดส่ง' },
        { value: 'shipped', labelKey: 'ร้านค้าจัดส่งแล้ว' },
        { value: 'cancelled', labelKey: 'ยกเลิก/ล้มเหลว' },
    ];

    statusTabs: Array<{ value: string; labelKey: string }> = [...this.baseStatusTabs];

    selectedStatus: string = '';

    department: any[] = [];
    position: any[] = [];
    @ViewChild('tableElement') tableElement!: ElementRef;

    permissionName = null;

    constructor(
        private translocoService: TranslocoService,
        private userService: OrderProductsService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _service: OrderProductsService,
        private activated: ActivatedRoute,
        private exportService: ExportService
    ) {

        this.form = this._fb.group({
            member_id: [''],
            date_start: [''],
            date_end: [''],
        });

        this.filterForm = this._fb.group({
            date_start: [''],
            date_end: [''],
            code: [''],
            member_id: [''],
            status: [''],
        });
        this.langues = localStorage.getItem('lang');

        this.permissionName = getPermissionName();

    }
    langues: any;
    languageUrl: any;

    ngOnInit(): void {
        this.activated.queryParamMap.subscribe(params => {
            this.type = params.get('type');
            this.statusTabs = this.buildStatusTabs(this.type);

            const initialStatus = this.type && this.isStatusInTabs(this.type)
                ? this.type
                : (this.statusTabs[0]?.value ?? '');

            this.selectedStatus = initialStatus;
            this.filterForm.patchValue({ status: '' }, { emitEvent: false });

            if (this.dtElement) {
                this.rerender();
            }
            console.log('Type subscribe:', this.type);
        });
        this._service.getOrders().subscribe((resp: any) => {
            this.orders = resp.data
            const memberIds = new Set();
            let totalProducts = 0;
            let totalPrice = 0;
            let totalYuan = 0;
            const statusCount: Record<string, number> = {};

            for (const order of this.orders) {
                this.summary.totalOrders++;
                memberIds.add(order.member?.id);

                totalPrice += +order.total_price;

                if (order.status) {
                    statusCount[order.status] = (statusCount[order.status] || 0) + 1;
                }

                for (const item of order.order_lists || []) {
                    totalProducts += item.product_qty;
                    if (item.product_real_price && order.exchange_rate) {
                        totalYuan += +item.product_real_price * item.product_qty / +order.exchange_rate;
                    }
                }
            }
            this.summary.totalMembers = memberIds.size;
            this.summary.totalProducts = totalProducts;
            this.summary.totalPrice = totalPrice;
            this.summary.totalYuanValue = totalYuan;
            this.summary.statuses = statusCount;

        })


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

        this.form.get('date_start')?.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(() => {
                console.log('🔁 Searching with date_start...');
                this.rerender();
            });

        this.formData = this._fb.group({
            ids: this._fb.array([]),
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

    type: string | null = null;

    loadTable(): void {
        const menuTitles = {
            action: {
                th: 'ดำเนินการ',
                en: 'Action',
                cn: '操作',
            },
            orderNumber: {
                th: 'หมายเลขฝากสั่ง',
                en: 'Order Number',
                cn: '订单号',
            },
            customer: {
                th: 'ลูกค้า',
                en: 'Customer',
                cn: '客户',
            },
            amountDue: {
                th: 'ยอดที่ต้องชำระ',
                en: 'Amount Due',
                cn: '应付金额',
            },
            transferAmount: {
                th: 'ยอดโอน',
                en: 'Transfer Amount',
                cn: '转账金额',
            },
            taxInvoice: {
                th: 'ออกใบกำกับภาษี',
                en: 'Tax Invoice',
                cn: '税务发票',
            },
            transferEvidence: {
                th: 'หลักฐานการโอน',
                en: 'Transfer Evidence',
                cn: '转账凭证',
            },
            paymentDateTime: {
                th: 'วันเวลาที่ชำระเงิน',
                en: 'Payment Date & Time',
                cn: '付款日期和时间',
            },
            adminOwner: {
                th: 'ผู้ดูแล',
                en: 'Admin Owner',
                cn: '管理员',
            },
            note: {
                th: 'หมายเหตุ',
                en: 'Note',
                cn: '备注',
            },
            status: {
                th: 'สถานะ',
                en: 'Status',
                cn: '状态',
            },
        };

        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true, // Set the flag
            filter: false,
            language: {
                url: this.languageUrl,
            },

            ajax: (dataTablesParameters: any, callback) => {

                if (this.filterForm.value.code) {
                    dataTablesParameters.code = this.filterForm.value.code;
                }
                if (this.filterForm.value.date_start) {
                    dataTablesParameters.date = this.filterForm.value.date_start;
                }
                if (this.form.value.date_start) {
                    dataTablesParameters.date = this.form.value.date_start;
                }
                const statusFilter = this.selectedStatus || this.filterForm.value.status;
                if (statusFilter) {
                    dataTablesParameters['status'] = statusFilter;
                } else {
                    delete dataTablesParameters['status'];
                }
                dataTablesParameters['date_end'] = !!this.filterForm.value
                    .date_end
                    ? DateTime.fromISO(
                        this.filterForm.value.date_end.toString()
                    )
                        .toLocal()
                        .toFormat('yyyy-MM-dd')
                    : '';


                dataTablesParameters['member_id'] =
                    this.filterForm.value.member_id;
                dataTablesParameters['code'] = this.filterForm.value.code;

                this.userService.datatable(dataTablesParameters).subscribe({
                    next: (resp: any) => {
                        this.dataRow = resp.data.data;
                        callback({
                            recordsTotal: resp.data.total,
                            recordsFiltered: resp.data.total,
                            data: resp.data.data,
                        });
                    },
                    error: (err: any) => {
                        this.toastr.error('Load table error.');
                    },
                });
            },
            columns: [
                {
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                    orderable: false,
                },
                {
                    title: menuTitles.action[this.langues],
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.update,
                    },
                    className: 'w-10 text-center',
                    orderable: false,
                },
                {
                    title: menuTitles.orderNumber[this.langues],
                    data: 'code',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.edit,
                    },
                },
                {
                    title: menuTitles.customer[this.langues],
                    data: 'fullname',
                    className: 'text-left',
                    orderable: false,
                    // ngTemplateRef: {
                    //     ref: this.member,
                    // },
                },
                {
                    title: menuTitles.amountDue[this.langues],
                    data: 'total_price',
                    className: 'text-center',
                    render: function (data, type, row) {
                        return parseFloat(data).toFixed(2);
                    },
                },
                {
                    title: menuTitles.transferAmount[this.langues],
                    data: 'order_payment.total_price',
                    className: 'text-center',
                    defaultContent: '0.00',
                    render: function (data, type, row) {
                        if (data === null || data === undefined) {
                            return '0.00';
                        }
                        return parseFloat(data).toFixed(2);
                    }
                },
                {
                    title: menuTitles.taxInvoice[this.langues],
                    data: function (row: any) {
                        return row.bill_vat === 'Y' ? 'Yes' : 'No';
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.transferEvidence[this.langues],
                    data: 'order_payment',
                    defaultContent: '-',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.pic,
                    },
                },
                {
                    title: menuTitles.paymentDateTime[this.langues],
                    data: function (row: any) {
                        const createdAt = row.order_payment
                            ? row.order_payment.created_at
                            : null;

                        return createdAt
                            ? DateTime.fromISO(createdAt, { zone: 'utc' }).toLocal().toFormat('dd/MM/yyyy HH:mm')
                            : '-';
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.adminOwner[this.langues],
                    data: 'update_by',
                    defaultContent: '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.note[this.langues],
                    data: 'note',
                    defaultContent: '-',
                    className: 'text-center',
                },
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
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }

    get selectedStatusIndex(): number {
        const index = this.statusTabs.findIndex((tab) => tab.value === this.selectedStatus);
        return index >= 0 ? index : 0;
    }

    onStatusTabChange(event: MatTabChangeEvent): void {
        const nextStatus = this.statusTabs[event.index]?.value ?? '';
        if (this.selectedStatus === nextStatus) {
            return;
        }
        this.selectedStatus = nextStatus;
        this.filterForm.patchValue({ status: '' }, { emitEvent: false });
        if (this.dtElement) {
            this.rerender();
        }
    }

    private isStatusInTabs(status: string | null): boolean {
        return status !== null && this.statusTabs.some((tab) => tab.value === status);
    }

    private buildStatusTabs(type: string | null): Array<{ value: string; labelKey: string }> {
        if (type === 'in_progress' || type === 'confirm_payment') {
            return [
                { value: 'in_progress', labelKey: 'order_products.order_status.in_progress' },
                { value: 'confirm_payment', labelKey: 'order_products.order_status.confirm_payment' },
            ];
        }

        return [...this.baseStatusTabs];
    }

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
        this.filterForm.reset();
    }

    applyFilter() {
        const filterValues = this.filterForm.value;
        console.log(filterValues);
        if (filterValues.status && this.isStatusInTabs(filterValues.status)) {
            this.selectedStatus = filterValues.status;
        } else if (!filterValues.status) {
            this.selectedStatus = this.statusTabs[0]?.value ?? '';
        } else {
            this.selectedStatus = '';
        }
        this.rerender();
    }

    opendialogapro() {
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

    openDialogEdit(item: any) {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'EDIT',
                value: item,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }
    openDialogStatus(item: any) {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'EDIT',
                value: item,
                department: this.department,
                position: this.position,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    clickDelete(id: any) {
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate('confirmation.delete_title'),
            message: this.translocoService.translate(
                'confirmation.delete_message'
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
                this.userService.delete(id).subscribe({
                    error: (err) => { },
                    complete: () => {
                        this.toastr.success(
                            this.translocoService.translate(
                                'toastr.del_successfully'
                            )
                        );
                        this.rerender();
                    },
                });
            }
        });
    }
    openForm() {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '600px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW',
                department: this.department,
                position: this.position,
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
                const id = this.formData.get('ids').value;
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
                        complete: () => { },
                    });
                    if (i == id.length - 1) {
                        this.formData.get('ids').reset();
                        this.toastr.success(
                            this.translocoService.translate('toastr.delete')
                        );
                        this.rerender();
                    }
                }
            }
        });
    }

    openDialogPayment(item: any) {
        this._service.get(item.id).subscribe((resp: any) => {
            const dialog = this.dialog.open(DialogUpdatePaymentComponent, {
                width: '600px',
                data: {
                    order: resp?.data,
                },
            })

            dialog.afterClosed()
                .subscribe((result) => {
                    if (result) {
                        this.rerender();
                    }
                });
        });


    }

    clickUpdateStatus(item: any) {
        this.dialog
            .open(DialogUpdateStatusComponent, {
                width: '500px',
                data: {
                    orders: [item],
                    status: [
                        {
                            value: 'awaiting_summary',
                            name: 'รอสรุปยอด'
                        },
                        {
                            value: 'awaiting_payment',
                            name: 'รอชำระค่าสั่งซื้อ',
                        },
                        {
                            value: 'in_progress',
                            name: 'รอตรวจสอบสลิป',
                        },
                        {
                            value: 'confirm_payment',
                            name: 'ยืนยันการชำระเงิน',
                        },
                        {
                            value: 'preparing_shipment',
                            name: 'สินค้าเตรียมจัดส่ง',
                        },
                        {
                            value: 'shipped',
                            name: 'ร้านค้าจัดส่งแล้ว'
                        },
                        {
                            value: 'cancelled',
                            name: 'ยกเลิก/ล้มเหลว'
                        },
                    ],
                },
            })
            .afterClosed()
            .subscribe(() => {
                this.rerender();
            });
    }

    selectMember(item: any) {
        this.filterForm.patchValue({
            member_id: item?.id,
        });
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

    clearFilter() {
        this.filterForm.reset();
        this.rerender();
    }

    imageLoadedMap: { [key: string]: boolean } = {};

    onImageError(id: string) {
        this.imageLoadedMap[id] = false;
    }

    onImageLoad(id: string) {
        this.imageLoadedMap[id] = true;
    }

    exportData(type: 'csv' | 'excel' | 'print' | 'copy') {
        this.exportService.exportTable(this.tableElement, type);
    }

    copyFullTable(): void {
        const table = ($(this.tableElement.nativeElement) as any).DataTable();
        const rowsData = table.rows({ search: 'applied' }).data();

        const headers = [
            '#', 'Order Number', 'Customer', 'Amount Due', 'Transfer Amount',
            'Tax Invoice', 'Transfer Evidence', 'Payment Date & Time', 'Note', 'Status'
        ];

        const rows: any[][] = [];

        for (let i = 0; i < rowsData.length; i++) {
            const row = rowsData[i];
            rows.push([
                i + 1,
                row.code || '',
                row.member?.importer_code + '  ' + row.member?.fname + ' ' + row.member?.lname || '',
                parseFloat(row.total_price).toFixed(4),
                this.calculatePayment(row.order_payment),
                row.invoice ? 'Yes' : 'No',
                row.order_payment?.[row.order_payment.length - 1]?.image || '-',
                row.order_payment?.[row.order_payment.length - 1]?.date || '-',
                row.note || '',
                row.status || ''
            ]);
        }

        copyToClipboard(headers, rows, this.toastr);
    }
    calculatePayment(payments: any[]): number | string {
        if (!payments || !payments.length) return '-';
        return payments.reduce((sum, p) => sum + (p.total_price || 0), 0).toFixed(4);
    }


}
