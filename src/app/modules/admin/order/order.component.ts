import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';

import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogRef } from '@angular/cdk/dialog';
import { DialogForm } from './form-dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from './order.service';
import { DateTime } from 'luxon';
import { orderBy } from 'lodash';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { StatusBadgeComponent } from 'app/modules/shared/status-badge/status-badge.component';
import { StatusShipmentComponent } from 'app/modules/shared/status-shipment/status-shipment.component';
import { DynamicDialogComponent } from './dialog/dynamic-dialog.component';
@Component({
    selector: 'app-order',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatCheckboxModule,
        CdkMenuModule,
        MatTabsModule,
        StatusBadgeComponent,
        StatusShipmentComponent
    ],
    templateUrl: './order.component.html',
    styleUrl: './order.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class OrderComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    showFilterForm: boolean = false;
    @ViewChild('btNg') btNg: any;
    @ViewChild('statusCustomer') statusCustomer: any;
    @ViewChild('orderNo') orderNo: any;
    @ViewChild('statusOrder') statusOrder: any;
    @ViewChild('shipment') shipment: any;
    allowedStatuses = ['waiting']; // กำหนด status ที่อนุญาตให้แสดง checkbox
    @ViewChild('checkbox', { static: true }) checkbox: TemplateRef<any>;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    formstatus: FormGroup
    form: FormGroup;
    formData: FormGroup;
    filterForm: FormGroup;
    filterStatus: any[] = [
        'complete',
        'void'
    ]

    dataTest = [
        // waiting_check
        {
            no: 1,
            customer_code: '#M001',
            order_no: 'OD001',
            customer_name: 'Kevin Boy',
            shipment_by: 'car',
            date: '2025-12-31 12:04',
            order_status: 'waiting',
            china_status: 'Waiting',
            po_no: 'PO0001',
            remark: 'ระวังแตก',
            status: 'waiting_check'
        },
        {
            no: 2,
            customer_code: '#M002',
            order_no: 'OD002',
            customer_name: 'Lily Chen',
            shipment_by: 'ship',
            date: '2025-12-25 10:30',
            order_status: 'waiting',
            china_status: 'Checking',
            po_no: 'PO0002',
            remark: '',
            status: 'waiting_check'
        },
        {
            no: 3,
            customer_code: '#M003',
            order_no: 'OD003',
            customer_name: 'James Wu',
            shipment_by: 'ship',
            date: '2025-12-20 09:45',
            order_status: 'waiting',
            china_status: 'New',
            po_no: 'PO0003',
            remark: 'ต้องรีบ',
            status: 'waiting_check'
        },

        // checking
        {
            no: 4,
            customer_code: '#M004',
            order_no: 'OD004',
            customer_name: 'Sarah Tan',
            shipment_by: 'car',
            date: '2025-11-30 13:00',
            order_status: 'pending',
            china_status: 'In Progress',
            po_no: 'PO0004',
            remark: '',
            status: 'checking'
        },
        {
            no: 5,
            customer_code: '#M005',
            order_no: 'OD005',
            customer_name: 'Tom Lee',
            shipment_by: 'ship',
            date: '2025-11-25 08:15',
            order_status: 'pending',
            china_status: 'Verifying',
            po_no: 'PO0005',
            remark: 'ดูดีๆ',
            status: 'checking'
        },
        {
            no: 6,
            customer_code: '#M006',
            order_no: 'OD006',
            customer_name: 'Amy Wong',
            shipment_by: 'ship',
            date: '2025-11-20 14:20',
            order_status: 'pending',
            china_status: 'Confirming',
            po_no: 'PO0006',
            remark: '',
            status: 'checking'
        },

        // wait_customer
        {
            no: 7,
            customer_code: '#M007',
            order_no: 'OD007',
            customer_name: 'Ben Zhang',
            shipment_by: 'car',
            date: '2025-10-10 11:45',
            order_status: 'wait_customer',
            china_status: 'Waiting Customer',
            po_no: 'PO0007',
            remark: '',
            status: 'wait_customer'
        },
        {
            no: 8,
            customer_code: '#M008',
            order_no: 'OD008',
            customer_name: 'Emily Tran',
            shipment_by: 'ship',
            date: '2025-10-12 15:00',
            order_status: 'wait_customer',
            china_status: 'Pending Info',
            po_no: 'PO0008',
            remark: 'ลูกค้าติดต่อล่าช้า',
            status: 'wait_customer'
        },
        {
            no: 9,
            customer_code: '#M009',
            order_no: 'OD009',
            customer_name: 'Zhao Kai',
            shipment_by: 'ship',
            date: '2025-10-05 16:30',
            order_status: 'wait_customer',
            china_status: 'Hold',
            po_no: 'PO0009',
            remark: '',
            status: 'wait_customer'
        },

        // wait_payment
        {
            no: 10,
            customer_code: '#M010',
            order_no: 'OD010',
            customer_name: 'Chan Li',
            shipment_by: 'car',
            date: '2025-09-15 10:00',
            order_status: 'wait_payment',
            china_status: 'Pending Payment',
            po_no: 'PO0010',
            remark: 'แจ้งแล้ว',
            status: 'wait_payment'
        },
        {
            no: 11,
            customer_code: '#M011',
            order_no: 'OD011',
            customer_name: 'Rachel Chua',
            shipment_by: 'ship',
            date: '2025-09-18 12:15',
            order_status: 'wait_payment',
            china_status: 'Unpaid',
            po_no: 'PO0011',
            remark: '',
            status: 'wait_payment'
        },
        {
            no: 12,
            customer_code: '#M012',
            order_no: 'OD012',
            customer_name: 'wait_payment',
            shipment_by: 'ship',
            date: '2025-09-20 14:00',
            order_status: 'Unpaid',
            china_status: 'Waiting Fund',
            po_no: 'PO0012',
            remark: '',
            status: 'wait_payment'
        },

        // wait_approve
        {
            no: 13,
            customer_code: '#M013',
            order_no: 'OD013',
            customer_name: 'Tina Guo',
            shipment_by: 'car',
            date: '2025-08-01 11:00',
            order_status: 'wait_approve',
            china_status: 'Pending Approval',
            po_no: 'PO0013',
            remark: '',
            status: 'wait_approve'
        },
        {
            no: 14,
            customer_code: '#M014',
            order_no: 'OD014',
            customer_name: 'Leo Kim',
            shipment_by: 'ship',
            date: '2025-08-05 13:30',
            order_status: 'wait_approve',
            china_status: 'Checking Docs',
            po_no: 'PO0014',
            remark: 'ขออนุมัติเร็วๆ',
            status: 'wait_approve'
        },
        {
            no: 15,
            customer_code: '#M015',
            order_no: 'OD015',
            customer_name: 'Mia Lao',
            shipment_by: 'ship',
            date: '2025-08-10 15:15',
            order_status: 'wait_approve',
            china_status: 'Awaiting',
            po_no: 'PO0015',
            remark: '',
            status: 'wait_approve'
        },

        // approved
        {
            no: 16,
            customer_code: '#M016',
            order_no: 'OD016',
            customer_name: 'Jack Ng',
            shipment_by: 'car',
            date: '2025-07-01 09:00',
            order_status: 'approved',
            china_status: 'Ready',
            po_no: 'PO0016',
            remark: '',
            status: 'approved'
        },
        {
            no: 17,
            customer_code: '#M017',
            order_no: 'OD017',
            customer_name: 'Grace Lim',
            shipment_by: 'ship',
            date: '2025-07-05 10:30',
            order_status: 'approved',
            china_status: 'OK',
            po_no: 'PO0017',
            remark: '',
            status: 'approved'
        },
        {
            no: 18,
            customer_code: '#M018',
            order_no: 'OD018',
            customer_name: 'Tony Yip',
            shipment_by: 'ship',
            date: '2025-07-08 13:45',
            order_status: 'approved',
            china_status: 'Pass',
            po_no: 'PO0018',
            remark: '',
            status: 'approved'
        },

        // canceled
        {
            no: 19,
            customer_code: '#M019',
            order_no: 'OD019',
            customer_name: 'Ivan Foo',
            shipment_by: 'car',
            date: '2025-06-20 10:15',
            order_status: 'canceled',
            china_status: 'Cancelled',
            po_no: 'PO0019',
            remark: 'ลูกค้าขอยกเลิก',
            status: 'canceled'
        },
        {
            no: 20,
            customer_code: '#M020',
            order_no: 'OD020',
            customer_name: 'Sophia Liu',
            shipment_by: 'ship',
            date: '2025-06-22 11:50',
            order_status: 'canceled',
            china_status: 'Not Shipped',
            po_no: 'PO0020',
            remark: '',
            status: 'canceled'
        },
        {
            no: 21,
            customer_code: '#M021',
            order_no: 'OD021',
            customer_name: 'William Koh',
            shipment_by: 'ship',
            date: '2025-06-25 14:30',
            order_status: 'canceled',
            china_status: 'N/A',
            po_no: 'PO0021',
            remark: 'ยกเลิกเนื่องจากสินค้าขาด',
            status: 'canceled'
        },

        // complete
        {
            no: 22,
            customer_code: '#M022',
            order_no: 'OD022',
            customer_name: 'Hannah Goh',
            shipment_by: 'car',
            date: '2025-05-01 09:10',
            order_status: 'claim',
            china_status: 'Done',
            po_no: 'PO0022',
            remark: '',
            status: 'claim'
        },
        {
            no: 23,
            customer_code: '#M023',
            order_no: 'OD023',
            customer_name: 'Lucas Ong',
            shipment_by: 'ship',
            date: '2025-05-03 12:40',
            order_status: 'claim',
            china_status: 'Complete',
            po_no: 'PO0023',
            remark: '',
            status: 'claim'
        },
        {
            no: 24,
            customer_code: '#M024',
            order_no: 'OD024',
            customer_name: 'Diana Chai',
            shipment_by: 'ship',
            date: '2025-05-07 14:50',
            order_status: 'claim',
            china_status: 'Clear',
            po_no: 'PO0024',
            remark: 'ส่งของครบ',
            status: 'claim'
        }
    ];

    statuses = [
        { key: '', label: 'ทั้งหมด', count: 24 },
        { key: 'waiting', label: 'รอตรวจสอบ', count: 3 },
        { key: 'pending', label: 'กำลังตรวจสอบ', count: 3 },
        { key: 'wait_customer', label: 'รอลูกค้าจ่าย', count: 3 },
        { key: 'wait_payment', label: 'รอจ่ายร้านจีน', count: 3 },
        { key: 'wait_approve', label: 'รอใส่เลขแทรคกิ้งจีน', count: 3 },
        { key: 'approved', label: 'สั่งซื้อสำเร็จ', count: 3 },
        { key: 'canceled', label: 'ยกเลิก', count: 3 },
        { key: 'claim', label: 'เคลมรายการ', count: 3 },
    ];
    title: string = '';
    typePage: string = '';
    selectedTabIndex = 0;



    constructor(
        private _service: OrderService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _router: Router,
        private _activated: ActivatedRoute
    ) {
        this.title = this._activated.snapshot.data.title
        this.typePage = this._activated.snapshot.data.type

        this.formstatus = this._fb.group({
            filter_status: ''
        })
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
            status: ['']
        });
    }
    ngOnInit(): void {
        setTimeout(() =>
            this.loadTable());

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

    formatDateTime(date: string): string {
        return DateTime.fromISO(date).toFormat('dd/MM/yyyy HH:mm:ss');
    }

    onChangeStatus() {
        this.rerender()
    }

    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,     // Set the flag
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.filter = {
                    'filter.orderStatus': this.formstatus.value.filter_status
                }
                // this._service.datatable(dataTablesParameters).subscribe({
                //     next: (resp: any) => {
                //         callback({
                //             recordsTotal: resp.meta.totalItems,
                //             recordsFiltered: resp.meta.totalItems,
                //             data: resp.data
                //         });
                //     }
                // })
                callback({

                    data: this.dataTest.filter(item => {
                        const filter = this.formstatus.value.filter_status;
                        return !filter || item.order_status === filter;
                    }),
                    recordsTotal: this.dataTest.length,
                    recordsFiltered: this.dataTest.length,
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
                    data: 'no',
                    defaultContent: '-',
                    className: 'w-15 text-center'
                },
                {
                    title: 'เลขออร์เดอร์',
                    defaultContent: '-',
                    data: null,
                    ngTemplateRef: {
                        ref: this.orderNo,
                    },
                    className: 'text-center',
                },
                {
                    title: 'รหัสลูกค้า',
                    defaultContent: '-',
                    data: 'customer_code',
                    ngTemplateRef: {
                        ref: this.statusCustomer,
                    },
                    className: 'text-center',
                },
                {
                    title: 'ชื่อลูกค้า',
                    defaultContent: '-',
                    data: 'customer_name',
                    className: 'text-center',
                },
                {
                    title: 'ขนส่งโดย',
                    defaultContent: '-',
                    data: null,
                    ngTemplateRef: {
                        ref: this.shipment,
                    },
                    className: 'text-center',
                },
                {
                    title: 'วันที่และเวลา',
                    defaultContent: '-',
                    data: 'date',
                    className: 'text-center',
                },
                {
                    title: 'สถานะออร์เดอร์',
                    defaultContent: '-',
                    data: null,
                    ngTemplateRef: {
                        ref: this.statusOrder,
                    },
                    className: 'text-center',
                },
                {
                    title: 'สถานะแทรคกิ้งจีน',
                    defaultContent: '-',
                    data: 'china_status',
                    className: 'text-center',
                },
                {
                    title: 'PO ID',
                    defaultContent: '-',
                    data: 'po_no',
                    className: 'text-center',
                },
                {
                    title: 'หมายเหตุ',
                    defaultContent: '-',
                    data: 'remark',
                    className: 'text-center',
                },


            ],
            // orderBy: [[1, 'DESC']]
        }
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }

    opendialogapro() {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW'
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result')
                this.rerender();
            }
        });
    }

    openDialogEdit(item: any) {
        this._service.getById(item.id).subscribe((resp: any) => {

            const DialogRef = this.dialog.open(DialogForm, {
                disableClose: true,
                width: '500px',
                height: 'auto',
                enterAnimationDuration: 300,
                exitAnimationDuration: 300,
                data: {
                    type: 'EDIT',
                    value: resp
                }
            });
            DialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    console.log(result, 'result')
                    this.rerender();
                }
            });
        })

    }

    clickVoid(id: any) {
        const confirmation = this.fuseConfirmationService.open({
            title: "คุณต้องการ void ใช่หรือไม่ ?",
            message: "กรุณาตรวจสอบให้แน่ใจ หากยืนยันแล้วจะไม่สามารถย้อนกลับได้",
            icon: {
                show: true,
                name: "heroicons_outline:exclamation-triangle",
                color: "warn"
            },
            actions: {
                confirm: {
                    show: true,
                    label: "ยืนยัน",
                    color: "primary"
                },
                cancel: {
                    show: true,
                    label: "ยกเลิก"
                }
            },
            dismissible: false
        })

        confirmation.afterClosed().subscribe(
            result => {
                if (result == 'confirmed') {
                    this._service.voidOrder(id).subscribe({
                        error: (err) => {
                            this.toastr.error(err.error.message)
                        },
                        complete: () => {
                            this.toastr.success('ดำเนินการ void สำเร็จ');
                            this.rerender();
                        },
                    });
                }
            }
        )
    }

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
    }

    clickDelete(id: any) {
        const confirmation = this.fuseConfirmationService.open({
            title: "ยืนยันลบข้อมูล",
            message: "กรุณาตรวจสอบข้อมูล หากลบข้อมูลแล้วจะไม่สามารถนำกลับมาได้",
            icon: {
                show: true,
                name: "heroicons_outline:exclamation-triangle",
                color: "warn"
            },
            actions: {
                confirm: {
                    show: true,
                    label: "ยืนยัน",
                    color: "primary"
                },
                cancel: {
                    show: true,
                    label: "ยกเลิก"
                }
            },
            dismissible: false
        })
        confirmation.afterClosed().subscribe(
            result => {
                if (result == 'confirmed') {
                    this._service.delete(id).subscribe({
                        error: (err) => {

                        },
                        complete: () => {
                            this.toastr.success('ดำเนินการลบสำเร็จ');
                            this.rerender();
                        },
                    });
                }
            }
        )
    }

    onTabChange(index: number): void {
        const selectedStatus = this.filteredStatuses[index].key;
        this.formstatus.patchValue({ filter_status: selectedStatus });

        this.rerender();
    }

    filterByStatus(statusKey: string) {
        // ตัวอย่างการดึงข้อมูลใหม่ หรือกรองจากข้อมูลที่มี
        console.log('Filter ด้วยสถานะ:', statusKey);
        this.rerender(); // หรือเรียก method ที่โหลดข้อมูลใหม่
    }

    viewOrder(data: any) {
        console.log(data);

        this._router.navigate(['order/view/' + this.typePage + '/' + 1], {
            queryParams: { status: data.order_status }
        });
    }

    get filteredStatuses() {
        if (this.typePage === 'admin') {
            return this.statuses.filter(status => status.key !== 'waiting');
        }
        return this.statuses;
    }

    multiSelect: any[] = [];
    isAllSelected: boolean = false; // ใช้เก็บสถานะเลือกทั้งหมด

    toggleSelectAll(isSelectAll: boolean): void {
        this.isAllSelected = isSelectAll; // อัปเดตสถานะเลือกทั้งหมด

        if (isSelectAll) {
            // เลือกทั้งหมด: เพิ่ม id ของทุกแถวใน multiSelect
            this.dataTest.forEach((row: any) => {
                if (!this.multiSelect.includes(row.id)) {
                    this.multiSelect.push(row.id); // เพิ่ม id ถ้ายังไม่มีใน multiSelect
                }
                row.selected = true; // ตั้งค่า selected เป็น true
            });
        } else {
            // ยกเลิกการเลือกทั้งหมด: ลบ id ของทุกแถวออกจาก multiSelect
            this.dataTest.forEach((row: any) => {
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

    openOrderShowDialog(): void {
        const dialogRef = this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: {
                title: 'จัดการออร์เดอร์',
                type: 'order',
                message: '1 รายการนี้',
                error: '',
                reason: '' // Initialize empty reason
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.confirmed) {
                // this.resultData = {
                //     action: 'Order Cancelled',
                //     reason: result.data.reason
                // };
                this.toastr.success('ดำเนินการสำเร็จ');
                this.rerender();
                console.log('Order cancellation reason:', result.data.reason);
                // Call your API service here
            }
        });
    }



}


