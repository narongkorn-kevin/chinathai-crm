import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { PromotionService } from './page.service';
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
import { IsActiveLabelPipe } from 'app/modules/common/active-status.pipe';
@Component({
    selector: 'app-page-promotion',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,

    ],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe,IsActiveLabelPipe],
})
export class CategoryComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

    @ViewChild('btNg') btNg: any;
    @ViewChild('textStatus') textStatus: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    constructor(
        private _service: PromotionService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private isActivate: IsActiveLabelPipe,

    ) {

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

    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,     // Set the flag
            ajax: (dataTablesParameters: any, callback) => {
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
                    //className: 'text-center'
                    className: 'w-15 text-center'
                },
                {
                    title: 'รหัสโปรโมชั่น',
                    data: 'code',
                    className: 'w-30 text-center'
                },
                {
                    title: 'ชื่อโปรโมชั่น',
                    data: 'name',
                    className: 'text-center'
                },
                {
                    title: 'วันที่เริ่มต้น',
                    data: 'startDate',
                    ngPipeInstance: this.datePipe,
                    ngPipeArgs: ['dd-MM-yyyy'],
                    className: 'text-center'
                },

                {
                    title: 'วันที่สิ้นสุด',
                    data: 'endDate',
                    ngPipeInstance: this.datePipe,
                    ngPipeArgs: ['dd-MM-yyyy'],
                    className: 'text-center'
                },
                {
                    title: 'ประเภทโปรโมชั่น',
                    data: 'type',
                    render: (data: any) => {
                        if (data === 'gift') {
                            return 'บัตรกำนัล';
                        } else if (data === 'discount'){
                            return 'ส่วนลด';
                        } else{
                            return data;
                        }
                    },
                    className: 'text-center'
                },
                {
                    title: 'สถานะ',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.textStatus,
                    },
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



    opendialogapro() {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '680px',
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
        this._service.getPromotionId(item).subscribe((resp: any) => {
            const DialogRef = this.dialog.open(DialogForm, {
                disableClose: true,
                width: '680px',
                height: '90%',
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
