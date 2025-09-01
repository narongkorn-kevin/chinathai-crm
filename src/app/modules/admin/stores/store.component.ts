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
import { ActivatedRoute } from '@angular/router';
import { StoreService } from './store.service';
@Component({
    selector: 'app-store-device',
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
    templateUrl: './store.component.html',
    styleUrl: './store.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class StoreComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild('btNg') btNg: any;
    @ViewChild('pic') pic: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    constructor(
        private _service: StoreService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private activated: ActivatedRoute

    ) { }

    ngOnInit(): void {
        console.log('store');

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
                this._service.datatable(dataTablesParameters)
                    .pipe(
                        map((resp: { data: any }) => resp.data)
                    )
                    .subscribe({
                        next: (resp: any) => {
                            console.log('resp', resp);

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
                    title: 'รูปภาพ',
                    data: null,
                    className: '',
                    ngTemplateRef: {
                        ref: this.pic,
                    },
                },
                {
                    title: 'ชื่อ',
                    data: 'name',
                    className: ''
                },
                {
                    title: 'รายละเอียด',
                    data: 'description',
                    className: ''
                },
                {
                    title: 'ที่อยู่',
                    data: 'address',
                    className: ''
                },
                {
                    title: 'เบอร์',
                    data: 'phone',
                    className: ''
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
            width: '95%', // เปลี่ยนจาก 500px เป็น percentage
            maxWidth: '800px', // กำหนดความกว้างสูงสุด
            height: 'auto',
            panelClass: 'responsive-dialog', // เพิ่มคลาสสำหรับ styling เพิ่มเติม
            data: {
                type: 'NEW',
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.rerender();
            }
        });
    }

    openDialogEdit(item: any) {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '95%', // เปลี่ยนจาก 500px เป็น percentage
            maxWidth: '800px', // กำหนดความกว้างสูงสุด
            height: 'auto',
            panelClass: 'responsive-dialog', // เพิ่มคลาสสำหรับ styling เพิ่มเติม
            data: {
                type: 'EDIT',
                value: item,
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
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

    onImageError(data: any): void {
        data.imageError = true;
    }

}
