import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { PanelService } from './page.service';
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
import { Router } from '@angular/router';
@Component({
    selector: 'app-page-panel',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule
    ],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class PanelComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild('btNg') btNg: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    @Input() storeId: any;
    @Output() dataArrayChange = new EventEmitter<any[]>();

    constructor(
        private _service: PanelService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private router: Router

    )
    {


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
                    className: 'w-15'
                },

                {
                    title: 'ชื่อหน้าจอ',
                    data: 'name'
                },
                {
                    title: 'จัดการ',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.btNg,
                    },
                    className: 'w-15'
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



    opendialogAdd() {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '500px',
            height: '90%',
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
        this._service.getById(item).subscribe( (resp: any)=>{
            this.branch = resp;
            const DialogRef = this.dialog.open(DialogForm, {
                disableClose: true,
                width: '500px',
                height: '90%',
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

    addPanel() {
        this.router.navigateByUrl('panel/form')
    }
}
