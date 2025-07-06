import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { FollowUpService } from './follow-up.service';
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
    selector: 'app-follow-up-list',
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
    templateUrl: './follow-up.component.html',
    styleUrl: './follow-up.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class FollowUpComponent implements OnInit, AfterViewInit {
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
    @ViewChild('caseNo') caseNo: any;
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
            case_no: 'CA001',
            tracking_thai: 'TH00019234',
            order_no: 'OD123455',
            customer_code: 'CT054',
            customer_name: 'KEVIN',
            status: 'wait',
            department: 'AZ9999999999',
            
            zone: 'Chinatai',
            status_icon: 'error', // ใช้สำหรับแสดง icon สี
        },
        {
            id: 2,
            datetime: '2025-06-15 09:19',
            case_no: 'CA002',
            tracking_thai: 'TH00019234',
            order_no: 'OD123452',
            customer_code: 'CT054',
            customer_name: 'KEVIN',
            status: 'close',
            department: 'AZ9999999999',
            zone: 'Chinatai',
            status_icon: 'error',
        },
        {
            id: 3,
            datetime: '2025-06-12 08:12',
            case_no: 'CA003',
            tracking_thai: 'TH00019234',
            order_no: 'OD123454',
            customer_code: 'CT054',
            customer_name: 'KEVIN',
            department: 'AZ9999999999',
            status: 'pending',
            zone: 'Chinatai',
            status_icon: 'error',
        }
    ];

    statusLabel: string = ''
    constructor(
        private userService: FollowUpService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _service: FollowUpService,
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
        this._router.navigate(['/follow-up/create'])
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
                    recordsTotal: this.repairRequests.length,
                    recordsFiltered: this.repairRequests.length,
                    data: this.repairRequests
                });
            },
            columns: [
                {
                    title: 'สถานะ',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.status,
                    },
                    className: 'w-20 text-left h-10',
                    orderable: false,
                },
                 {
                    title: 'Case No.',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.caseNo,
                    },
                    className: 'w-20 text-center',
                    orderable: false,
                },

                {
                    title: 'วันเวลา',
                    data: 'datetime',
                    className: 'text-center',
                    defaultContent: '',
                },
                {
                    title: 'เลขแทรคกิ้งไทย',
                    data: 'tracking_thai',
                    className: 'text-center',
                    defaultContent: '',
                },
                {
                    title: 'เลขออร์เดอร์',
                    data: 'order_no',
                    className: 'text-center',
                    defaultContent: '',
                },
                {
                    title: 'รหัสลูกค้า',
                    data: null,
                    className: 'text-center',
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.member,
                    },

                },
                {
                    title: 'ชื่อลูกค้า',
                    data: 'customer_name',
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

    color(data: any): string {
        switch (data) {
            case 'pending': return 'bg-orange-500 ring-orange-200';
            case 'wait': return 'bg-blue-500 ring-blue-200';
            case 'close': return 'bg-green-500 ring-green-200';
            case 'error': return 'bg-red-500 ring-red-200';
            default: return 'bg-gray-400 ring-gray-200';
        }
    }

    label(data: any): string {
        switch (data) {
            case 'pending': return 'รอรับ Case';
            case 'wait': return 'กำลังตรวจสอบ';
            case 'close': return 'ปิด Case';
            case 'error': return 'เกิดข้อผิดพลาด';
            default: return 'ไม่ทราบสถานะ';
        }
    }
}
