import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ClaimOrderService } from './claim-order.service';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DialogUpdatePaymentComponent } from '../dialog/dialog-update-payment/dialog-update-payment.component';
import { DialogUpdateStatusComponent } from '../dialog/dialog-update-status-order/dialog.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { DateTime } from 'luxon';
import { DialogUpdatePaymentNewComponent } from '../dialog/dialog-update-payment-new/dialog-update-payment-new.component';

@Component({
    selector: 'app-import-product-order',
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
    templateUrl: './claim-order.component.html',
    styleUrl: './claim-order.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ImportProductOrderComponent implements OnInit, AfterViewInit {
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
    repairRequests = [
        {
            id: 1,
            datetime: '2025-06-17 12:12',
            request_no: 'RQ001',
            computer_type: 'การส่งของ',
            issue: 'ของไม่ส่ง',
            customer_code: 'AZ9999999999',
            customer_name: 'NAME',
            department: 'AZ9999999999',
            zone: 'Chinatai',
            status_icon: 'error', // ใช้สำหรับแสดง icon สี
        },
        {
            id: 2,
            datetime: '2025-06-15 09:19',
            request_no: 'RQ002',
            computer_type: 'การส่งของ',
            issue: 'ของไม่ส่ง',
            customer_code: 'AZ9999999999',
            customer_name: 'NAME',
            department: 'AZ9999999999',
            zone: 'Chinatai',
            status_icon: 'error',
        },
        {
            id: 3,
            datetime: '2025-06-12 08:12',
            request_no: 'RQ003',
            computer_type: 'การส่งของ',
            issue: 'ของไม่ส่ง',
            customer_code: 'AZ9999999999',
            customer_name: 'NAME',
            department: 'AZ9999999999',
            zone: 'Chinatai',
            status_icon: 'error',
        }
    ];


    constructor(
        private userService: ClaimOrderService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _service: ClaimOrderService,
        private activated: ActivatedRoute,
        private _router: Router
    ) {
        // this.department = this.activated.snapshot.data.department.data;
        // this.position = this.activated.snapshot.data.position.data;
        
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

    addClaimOrder() {
        this._router.navigate(['/claim/create'])
    }

    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,     // Set the flag
            // stateSave: true,
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

                // this.userService.datatable(dataTablesParameters).subscribe({
                //     next: (resp: any) => {


                //         this.dataRow = resp.data;
                //         callback({
                //             recordsTotal: resp.data.total,
                //             recordsFiltered: resp.data.total,
                //             data: this.repairRequests
                //         });
                //     },
                //     error: (err: any) => {
                //         this.toastr.error('Load table error.')
                //     }
                // })
                callback({
                    // recordsTotal: resp.data.total,
                    // recordsFiltered: resp.data.total,
                    data: this.repairRequests
                });
            },
            columns: [
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
                    title: '#',
                    data: 'id',
                    defaultContent: '',
                    className: 'w-10 text-center',
                    orderable: false,
                },

                {
                    title: 'วันเวลา',
                    data: 'datetime',
                    className: 'text-center',
                    defaultContent: '',
                },
                {
                    title: 'เลขที่คำร้อง',
                    data: 'request_no',
                    className: 'text-center',
                    defaultContent: '',
                },
                {
                    title: 'ประเภทออร์เดอร์',
                    data: 'computer_type',
                    className: 'text-center',
                    defaultContent: '',
                },
                {
                    title: 'เรื่องที่ร้องเรียน',
                    data: 'issue',
                    className: 'text-center',
                    defaultContent: '',
                },
                {
                    title: 'รหัสลูกค้า',
                    data: null,
                    className: 'text-center',
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.status,
                    },

                },
                {
                    title: 'ชื่อลูกค้า',
                    data: 'customer_name',
                    className: 'text-center',
                    defaultContent: '',
                },
                {
                    title: 'เลขที่ออร์เดอร์',
                    data: 'department',
                    className: 'text-center',
                    defaultContent: '',
                },
                {
                    title: 'โดย',
                    data: 'zone',
                    className: 'text-center',
                    defaultContent: '',
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
        this.dialog.open(DialogUpdatePaymentNewComponent, {
            width: '600px',
            data: {
                order: item,
                dataList: [
                    {
                        name: 'ค่าบริการส่วนที่ 1: ชำระก่อนเริ่มจัดทำ',
                        list: [
                            { name: 'ค่าธรรมเนียมศุลกากร', price: 3000 },
                            { name: 'ทำ FORM E', price: 2000 },
                        ],
                    },
                    {
                        name: 'ค่าบริการส่วนที่ 2: ชำระเมื่อได้รับใบฉบับร่าง',
                        list: [
                            { name: 'ค่าภาษีมูลค่าเพิ่ม', price: 700 },
                            { name: 'ค่าอากรค่าเข้า', price: 0 },
                            { name: 'ค่าธรรมเนียม', price: 200 },
                        ],
                    }
                ]
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                this.rerender();
            }
        })
    }

    clickUpdateStatus(item: any) {
        this.dialog.open(DialogUpdateStatusComponent, {
            width: '500px',
            data: {
                orders: [item],
                status: [
                    { value: 'importing_documents', name: 'นำเข้าเอกสาร', },
                    { value: 'waiting_for_document_review', name: 'รอตรวจสอบเอกสาร', },
                    { value: 'waiting_for_tax_payment', name: 'รอชำระภาษี', },
                    { value: 'in_progress', name: 'อยู่ระหว่างดำเนินการ', },
                    { value: 'completed', name: 'เสร็จสิ้น', },
                ],
                service: 'import-product-order'
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                this.rerender();
            }
        })
    }
}
