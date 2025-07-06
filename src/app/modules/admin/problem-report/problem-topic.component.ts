import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { map, Subject } from 'rxjs';
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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProblemTopicService } from './problem-topic.service';
import { DialogViewComponent } from './view/dialog-view.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
    selector: 'app-problem-topic-device-2',
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
        CdkMenuModule
    ],
    templateUrl: './problem-topic.component.html',
    styleUrl: './problem-topic.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ProblemTopicComponent implements OnInit, AfterViewInit {
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
        private _service: ProblemTopicService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _fb: FormBuilder,
        public dialog: MatDialog,
        private activated: ActivatedRoute

    ) {
        this.form = this._fb.group({
            name: [''],
            start_date: [''],
            end_date: [''],
        });

        this.filterForm = this._fb.group({
            // filter_date: [''],
            start_date: [''],
            end_date: [''],
            member_id: [''],
            problem_report_topic_id: [''],
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
                stateSave: true,
                ajax: (dataTablesParameters: any, callback) => {
                    this._service.datatable(dataTablesParameters).subscribe({
                        next: (resp: any) => {
                            console.log(resp, 'resp');

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
                        title: 'วันที่ร้องเรียน',
                        data: 'created_at',
                        className: 'text-center',
                        render: function (data: any) {
                            if (data) {
                                const date = new Date(data);
                                const year = date.getFullYear(); // ค.ศ.
                                const thaiYear = year + 543; // แปลงเป็น พ.ศ.
                                const day = ('0' + date.getDate()).slice(-2); // เติม 0 ถ้าตัวเลขหลักเดียว
                                const month = ('0' + (date.getMonth() + 1)).slice(-2); // เดือนเริ่มที่ 0 ต้องบวก 1
                                return `${year}-${day}-${month}`;
                            }
                            return '-';
                        }
                    },
                    {
                        title: 'รหัสลูกค้า',
                        data: function(row) {
                            return row.member?.code || '-';
                        },
                        className: 'text-center',
                        ngTemplateRef: {
                            ref: this.edit,
                        },
                    },
                    {
                        title: 'หัวข้อปัญหา',
                        data: function (data: any) {
                            return data.topic?.name;
                        },
                        className: 'text-center',
                        // ngTemplateRef: {
                        //     ref: this.edit,
                        // },
                    },
                    {
                        title: 'รายการ',
                        data: function (data: any) {
                            return data.master?.name;
                        },
                        className: 'text-center',
                    },
                    {
                        title: 'เรื่อง',
                        data: 'name',
                        className: 'text-center',
                    },
                    // {
                    //     title: 'สถานะ',
                    //     data: function (data: any) {
                    //         const status = data.status;
                    //         if (status == 'Pending') {
                    //             return '<span>รอดำเนินการ</span>';
                    //         }else{
                    //             return '<span>ดำเนินการเสร็จสิ้น</span>';
                    //         }
                    //     },
                    //     className: 'text-center'
                    // },
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
    }
