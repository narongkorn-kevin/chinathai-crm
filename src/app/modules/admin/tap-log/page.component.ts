import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { TaplogService } from './page.service';
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
import { DateTime } from 'luxon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-page-tap-log',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class TapLogComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild('btNg') btNg: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    form:FormGroup
    @Input() storeId: any;
    @Output() dataArrayChange = new EventEmitter<any[]>();
    cardTypeData : any[] = [
       'A', 'B', 'C', 'D'
    ]
    constructor(
        private _service: TaplogService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private fb : FormBuilder
    )
    {

    }
    ngOnInit(): void {
        this.form = this.fb.group({
            cardType: ''
        })
        setTimeout(() =>
            this.loadTable())
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }

    onChange() {

        if(this.form.value.cardType === 'ALL') {
            this.form.patchValue({
                cardType:''
            })
            this.rerender()
        } else {
            this.rerender()
        }
        
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true, // Set the flag
            //scrollX: true, 
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.filter = {
                    'filter.card.card_type': this.form.value.cardType ?? ''
                }
                this._service.datatable(dataTablesParameters).subscribe({
                    next: (resp: any) => {
                        callback({
                            recordsTotal: resp.meta.totalItems,
                            recordsFiltered: resp.meta.totalItems,
                            data: resp.data
                        });
                    }
                })
            },
            columns: [
                {
                    title: 'ลำดับ',
                    data: 'no',
                    className: 'w-15 text-center h-10'
                },
                {
                    title: 'วันที่/เวลา',
                    defaultContent: '-',
                    data: function(row: any) {
                        return DateTime.fromISO(row.datetime).toFormat('dd/MM/yyyy HH:mm:ss');
                    },
                    className: 'w-50 text-center'
                },
                {
                    title: 'รหัสพนักงาน',
                    defaultContent: '-',
                    data: 'card.member.code',
                    className: 'w-20 text-left'
                },
                {
                    title: 'ชื่อ',
                    defaultContent: '-',
                    data: 'card.member.firstname',
                    className: 'text-left'
                },
                {
                    title: 'นามสกุล',
                    defaultContent: '-',
                    data: 'card.member.lastname',
                    className: 'text-left'
                },
                {
                    title: 'S/N',
                    defaultContent: '-',
                    data: 'card.sn',
                    className: 'text-center'
                },
                {
                    title: 'ประเภทบัตร',
                    defaultContent: '-',
                    data: 'card.cardType',
                    className: 'text-center'
                },
                {
                    title: 'กะ',
                    defaultContent: '-',
                    data: 'shift.name',
                    className: 'text-center'
                },
                 {
                     title: 'จัดการ',
                     data: null,
                     defaultContent: '',
                     ngTemplateRef: {
                         ref: this.btNg,
                     },
                     className: 'w-15 text-center'
                 }

            ],
            order: [[1, 'DESC']]
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



    opendialogAdd() {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 500,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW',
                value: '',
                store: this.storeId
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result')
                this.rerender();
            }
        });
    }

    branch: any
    openDialogEdit(item: any) {
        this._service.getBranchId(item).subscribe( (resp: any)=>{
            this.branch = resp;
            const DialogRef = this.dialog.open(DialogForm, {
                disableClose: true,
                width: '500px',
                height: 'auto',
                enterAnimationDuration: 500,
                exitAnimationDuration: 300,
                data: {
                    type: 'EDIT',
                    value: this.branch,
                    store: this.storeId
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

    clickVoid(id: any){
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
                    this._service.voidTaplog(id).subscribe({
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
}
