import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { BannerService } from './banner.service';
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
import { Router } from '@angular/router';
import { PictureComponent } from '../picture/picture.component';
import { BannerComposeComponent } from './dialog/banner-compose/banner-compose.component';

@Component({
    selector: 'app-banner-banner',
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
    templateUrl: './banner.component.html',
    styleUrl: './banner.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class BannerComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

    @ViewChild('btNg') btNg: any;
    @ViewChild('btPicture') btPicture: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    @ViewChild('textStatus') textStatus: any;

    constructor(
        private _service: BannerService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _router: Router

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

                dataTablesParameters.filter = {
                  'filter.category.id': '',
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
                    className: 'w-15 text-center'
                },
                // {
                //     title: 'รหัสสินค้า',
                //     data: 'code',
                //     className: 'w-40'
                // },
                {
                    title: 'ชื่อแบนเนอร์',
                    data: 'title',
                    className: 'text-center'
                },
                // {
                //     title: 'ประเภทสินค้า',
                //     data: 'category.name'
                // },
                // {
                //     title: 'ราคา',
                //     data: 'price',
                //     render: function(data, type, row) {
                //         // ตรวจสอบว่าประเภทของการแสดงคือแสดงข้อมูลหรือไม่
                //         if (type === 'display') {
                //             // จัดรูปแบบข้อมูลเป็นราคาที่มีลูกน้ำคั่นและทศนิยม 2 ตำแหน่ง
                //             return parseFloat(data).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                //         }
                //         // สำหรับประเภทอื่น ๆ คืนค่าข้อมูลเดิม
                //         return data;
                //     }
                // },
                {
                    title: 'รูปแบนเนอร์',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.btPicture,
                    },
                    className: 'w-20 text-center'
                },

                {
                    title: 'แสดง',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.textStatus,
                    },
                    className: 'w-30 text-center'
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

    openDialogEdit(item: any) {
        console.log(item)
        this._service.get(item).subscribe((resp: any) =>{
        const DialogRef = this.dialog.open(BannerComposeComponent, {
            disableClose: true,
            width: '600px',
            height: '600px',
            data: {
                type: 'EDIT',
                value: resp
            },
            // panelClass: 'overflow-auto'
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result')
                this.rerender();
            }
        });

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
    showPicture(imgObject: string): void {
        console.log(imgObject)
        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }
    createBanner() {
        const DialogRef = this.dialog.open(BannerComposeComponent, {
            disableClose: true,
            width: '600px',
            height: '600px',
            // enterAnimationDuration: 300,
            // exitAnimationDuration: 300,
            data: {
                type: 'NEW'
            },
            // panelClass: 'overflow-auto'
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result')
                this.rerender();
            }
        });
    }
}
