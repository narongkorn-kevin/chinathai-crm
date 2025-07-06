import { CommonModule, DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CdkMenuModule } from '@angular/cdk/menu';
import { DateTime } from 'luxon';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { ExpenseRecordService } from '../expense-record.service';

@Component({
    selector: 'app-expense-record-detail',
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
        SelectMemberComponent,
    ],
    providers: [
        DecimalPipe,
    ],
    templateUrl: './expense-record-detail.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ExpenseRecordDetailComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild('tdCode') tdCode: any;
    @ViewChild('tdChange') tdChange: any;

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

    code: string;

    constructor(
        private readonly _service: ExpenseRecordService,
        private readonly fuseConfirmationService: FuseConfirmationService,
        private readonly toastr: ToastrService,
        public dialog: MatDialog,
        private readonly _fb: FormBuilder,
        private readonly activatedRoute: ActivatedRoute,
        public decimalPipe: DecimalPipe
    ) {
        this.code = this.activatedRoute.snapshot.params.code;

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

                // dataTablesParameters['date_start'] = !!this.filterForm.value.date_start
                //     ? DateTime.fromISO(this.filterForm.value.date_start.toString()).toLocal().toFormat('yyyy-MM-dd')
                //     : '';

                // dataTablesParameters['date_end'] = !!this.filterForm.value.date_end
                //     ? DateTime.fromISO(this.filterForm.value.date_end.toString()).toLocal().toFormat('yyyy-MM-dd')
                //     : '';

                // dataTablesParameters['status'] = this.filterForm.value.status
                // dataTablesParameters['member_id'] = this.filterForm.value.member_id
                // dataTablesParameters['code'] = this.filterForm.value.code

                this._service.datatableMember(dataTablesParameters).subscribe({
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
                    title: 'ยอดเงิน',
                    data: 'total',
                    defaultContent: 0,
                    className: 'text-center',
                    ngPipeInstance: this.decimalPipe,
                    ngPipeArgs: ['1.2-2']
                },
                {
                    title: 'ปรับเปลี่ยนยอดเงิน',
                    data: 'change',
                    defaultContent: 0,
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.tdChange,
                    },
                },
                {
                    title: 'ยอดเงินสุทธิ',
                    data: 'amount',
                    defaultContent: 0,
                    className: 'text-center',
                    ngPipeInstance: this.decimalPipe,
                    ngPipeArgs: ['1.2-2']
                },
                {
                    title: 'ลักษณะการเปลี่ยนแปลง',
                    data: 'action',
                    defaultContent: '',
                    className: 'text-center',
                },
                {
                    title: 'วัน-เวลาที่ทำรายการ',
                    data: 'date',
                    defaultContent: '',
                    className: 'text-center',
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

    selectMember(item: any) {
        this.filterForm.patchValue({
            member_id: item?.id
        })
    }
}
