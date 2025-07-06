import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { OrderProductsService } from './order-products.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogUpdatePaymentComponent } from '../dialog/dialog-update-payment/dialog-update-payment.component';
import { DialogUpdateStatusComponent } from '../dialog/dialog-update-status-order/dialog.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { DateTime } from 'luxon';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';

@Component({
    selector: 'app-order-products',
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
        RouterLink,
        MatCheckboxModule,
        CdkMenuModule,
        SelectMemberComponent
    ],
    templateUrl: './order-products.component.html',
    styleUrl: './order-products.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class OrderProductsComponent implements OnInit, AfterViewInit {
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

    department: any[] = [];
    position: any[] = [];

    constructor(
        private userService: OrderProductsService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _service: OrderProductsService,
        private activated: ActivatedRoute,
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
            status: ['']
        });
    }
    ngOnInit(): void {
        setTimeout(() =>
            this.loadTable());

        this.formData = this._fb.group({
            ids: this._fb.array([])
        })
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
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,     // Set the flag
            filter: false,
            ajax: (dataTablesParameters: any, callback) => {

                dataTablesParameters['date_start'] = !!this.filterForm.value.date_start
                    ? DateTime.fromISO(this.filterForm.value.date_start.toString()).toLocal().toFormat('yyyy-MM-dd')
                    : '';

                dataTablesParameters['date_end'] = !!this.filterForm.value.date_end
                    ? DateTime.fromISO(this.filterForm.value.date_end.toString()).toLocal().toFormat('yyyy-MM-dd')
                    : '';

                dataTablesParameters['status'] = this.filterForm.value.status
                dataTablesParameters['member_id'] = this.filterForm.value.member_id
                dataTablesParameters['code'] = this.filterForm.value.code

                this.userService.datatable(dataTablesParameters).subscribe({
                    next: (resp: any) => {
                        this.dataRow = resp.data;

                        callback({
                            recordsTotal: resp.data.total,
                            recordsFiltered: resp.data.total,
                            data: resp.data.data
                        });
                    },
                    error: (err: any) => {
                        this.toastr.error('Load table error.')
                    }
                })
            },
            columns: [
                {
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                    orderable: false,
                },
                {
                    title: 'ดำเนินการ',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.update,
                    },
                    className: 'w-10 text-center',
                    orderable: false,
                },
                {
                    title: 'หมายเลขฝากสั่ง',
                    data: 'code',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.edit,
                    },
                },
                {
                    title: 'ลูกค้า',
                    data: null,
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.member,
                    },
                },
                {
                    title: 'ยอดที่ต้องชำระ',
                    data: 'total_price',
                    className: 'text-center',
                    render: function (data, type, row) {
                        return parseFloat(data).toFixed(2);
                    }
                },
                {
                    title: 'ยอดโอน',
                    data: function (row: any) {
                        if (!row.order_payment) {
                            return '-';
                        }
                        let payment = 0;
                        for (let i = 0; i < row.order_payment.length; i++) {
                            payment += row.order_payment[i].total_price;
                        }
                        return payment;
                    },
                    className: 'text-center'
                },
                {
                    title: 'ออกใบกำกับภาษี',
                    data: function (row: any) {
                        return row.invoice ? 'Yes' : 'No';
                    },
                    className: 'text-center',
                },
                {
                    title: 'หลักฐานการโอน',
                    data: function (row: any) {
                        return row.order_payment?.length
                            ? row.order_payment[row.order_payment.length - 1].image || '-'
                            : '-';
                    },
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.pic,
                    },
                },
                {
                    title: 'วันเวลาที่ชำระเงิน',
                    data: function (row: any) {
                        return row.order_payment?.length
                            ? row.order_payment[row.order_payment.length - 1].date || '-'
                            : '-';
                    },
                    className: 'text-center',
                },
                {
                    title: 'หมายเหตุ',
                    data: 'note',
                    className: 'text-center',
                },
                {
                    title: 'สถานะ',
                    data: 'status',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.status,
                    },
                },
            ]
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

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
        this.filterForm.reset();
    }

    applyFilter() {
        const filterValues = this.filterForm.value;
        console.log(filterValues);
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
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'EDIT',
                value: item,
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result')
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
                position: this.position
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result')
                this.rerender();
            }
        });
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
                    this.userService.delete(id).subscribe({
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
                position: this.position
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result')
                this.rerender();
            }
        });
    }
    opendialogdelete() {
        const confirmation = this.fuseConfirmationService.open({
            title: "คุณแน่ใจหรือไม่ว่าต้องการลบรายการ",
            message: "คุณกำลังจะลบรายการหากกดยืนยันแล้วจะไม่สามารถเอากลับมาอีกได้",
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
                    const id = this.formData.get('ids').value;
                    console.log(id, 'id');

                    for (let i = 0; i < id.length; i++) {
                        this._service.delete(id[i]).subscribe({
                            error: (err) => {
                                this.toastr.error('ลบรายการสมาชิก ล้มเหลว โปรดลองใหม่อีกครั้งภายหลัง');
                                console.log(err, 'err');
                            },
                            complete: () => {

                            },
                        });
                        if (i == id.length - 1) {
                            this.formData.get('ids').reset();
                            this.toastr.success('ลบรายการสมาชิก สำเร็จ');
                            this.rerender();
                        }
                    }
                }
            }
        )
    }

    openDialogPayment(item: any) {
        const dialog = this.dialog.open(DialogUpdatePaymentComponent, {
            width: '600px',
            data: {
                order: item
            }
        })
    }

    clickUpdateStatus(item: any) {
        this.dialog.open(DialogUpdateStatusComponent, {
            width: '500px',
            data: {
                orders: [item],
                status: [
                    { value: 'awaiting_summary', name: 'รอสรุปยอด', },
                    { value: 'awaiting_payment', name: 'รอชำระค่าสั่งซื้อ', },
                    { value: 'in_progress', name: 'อยู่ระหว่างการสั่งซื้อ', },
                    { value: 'preparing_shipment', name: 'สินค้าเตรียมจัดส่ง', },
                    { value: 'shipped', name: 'ร้านค้าจัดส่งแล้ว', },
                    { value: 'cancelled', name: 'ยกเลิก/ล้มเหลว', },
                ]
            }
        }).afterClosed().subscribe(() => {
            this.rerender();
        })
    }

    selectMember(item: any) {
        this.filterForm.patchValue({
            member_id: item?.id
        })
    }
}
