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
import { DialogForm } from './form-dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CategoryManualService } from './page.service';
@Component({
    selector: 'app-page-category-manual',
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
export class CategoryManualComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild('btNg') btNg: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    constructor(
        private _service: CategoryManualService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private activated: ActivatedRoute

    ) { }

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
                this._service.datatable(dataTablesParameters)
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
                    data: 'prefix',
                    className: 'text-center'
                },
                {
                    title: 'หัวข้อ',
                    data: 'name',
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
            width: '800px',
            height: '80%',
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
        this._service.getGetById(item.id).subscribe((resp:any)=>{
            console.log(resp);
            
            const DialogRef = this.dialog.open(DialogForm, {
                disableClose: true,
                width: '800px',
                height: '80%',
                data: {
                    type: 'EDIT',
                    value: resp.data,
                }
            });
            DialogRef.afterClosed().subscribe((result) => {
                if (result) {
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
