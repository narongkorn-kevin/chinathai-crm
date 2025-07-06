import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { FeeService } from './page.service';
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
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-page-fee',
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
export class FeeComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

    @ViewChild('btNg') btNg: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    categoryfee: any
    constructor(
        private _Service: FeeService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private activated: ActivatedRoute

    ) {
        this.categoryfee = this.activated.snapshot.data.categoryfee.data
        console.log(this.categoryfee);
        
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
                this._Service.datatable(dataTablesParameters)
                    .pipe(
                        map((resp: { data: any }) => resp.data)
                    )
                    .subscribe({
                        next: (resp: any) => {
                            callback({
                                recordsTotal: resp.total,
                                recordsFiltered: resp.total,
                                data: resp.data
                            });
                        }
                    })
            },
            columns: [
                {
                    title: 'ลำดับ',
                    data: 'No',
                    className: 'w-15 text-center'
                },
                {
                    title: 'รหัส',
                    data: 'code',
                    defaultContent: '',
                    className: 'text-center'
                },
                {
                    title: 'ชื่อ',
                    data: 'name',
                    defaultContent: '',
                    className: 'text-left'
                },
                {
                    title: 'ราคา',
                    data: 'price',
                    defaultContent: '',
                    className: 'text-center'
                },
                {
                    title: 'ประเภท',
                    data: 'category_fee.name',
                    defaultContent: '',
                    className: 'text-left'
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
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW',
                categoryfee: this.categoryfee
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
                categoryfee: this.categoryfee
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
                    this._Service.delete(id).subscribe({
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
