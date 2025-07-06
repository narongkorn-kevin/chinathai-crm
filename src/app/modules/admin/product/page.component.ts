import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ProductService } from './product.service';
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
import { ProductComposeComponent } from './dialog/product-compose/product-compose.component';
import { DialogForm } from './form-dialog/dialog.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
    selector: 'app-page-product',
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
        MatInputModule,
        MatFormFieldModule
    ],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ProductComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    catagories: any[] = [];
    @ViewChild('btNg') btNg: any;
    @ViewChild('btPicture') btPicture: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    form: FormGroup
    constructor(
        private _service: ProductService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _router: Router,
        private _fb: FormBuilder

    ) {
        this._service.categories$.subscribe(resp => this.catagories = resp);
        this.form = this._fb.group({
            category_id: ''
        })
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

    onChangeType() {
        this.rerender()
    }

    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,     // Set the flag
            ajax: (dataTablesParameters: any, callback) => {

                dataTablesParameters.filter = {
                    'filter.category.id': this.form.value.category_id ?? ''
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
                {
                    title: 'รหัสสินค้า',
                    data: 'code',
                    className: 'w-30 text-center'
                },
                {
                    title: 'ชื่อสินค้า',
                    data: 'name',
                    className: 'text-center'
                },
                {
                    title: 'ประเภทสินค้า',
                    data: 'category.name',
                    className: 'text-center'
                },
                {
                    title: 'ราคา',
                    data: 'price',
                    render: function (data, type, row) {
                        // ตรวจสอบว่าประเภทของการแสดงคือแสดงข้อมูลหรือไม่
                        if (type === 'display') {
                            // จัดรูปแบบข้อมูลเป็นราคาที่มีลูกน้ำคั่นและทศนิยม 2 ตำแหน่ง
                            return parseFloat(data).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                        }
                        // สำหรับประเภทอื่น ๆ คืนค่าข้อมูลเดิม
                        return data;
                    }
                },
                {
                    title: 'หน่วยนับ',
                    data: 'unit.name',
                    className: 'text-center'
                },
                {
                    title: 'รูปสินค้า',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.btPicture,
                    },
                    className: 'w-15 text-center'
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

    createProduct() {
        console.log('create');
        const DialogRef = this.dialog.open(ProductComposeComponent, {
            disableClose: true,
            width: 'calc(100% - 100px)',
            height: 'calc(100% - 30px)',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            maxWidth: "100%",
            maxHeight: 'calc(100% - 30px)',

            data: {
                type: 'NEW'
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.rerender();
            }
        });
    }

   
   

    opendialogapro2() {
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
        this._service.getById(item.id).subscribe((result) => {
            const dialogRef = this.dialog.open(ProductComposeComponent, {
                disableClose: true,
                width: 'calc(100% - 30px)',
                height: 'calc(100% - 30px)',
                enterAnimationDuration: 300,
                exitAnimationDuration: 300,
                data: {
                    type: 'EDIT',
                    value: result
                },
                maxWidth: "100%",
                maxHeight: 'calc(100% - 30px)'
            });

            dialogRef.afterClosed().subscribe((result) => {
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
}
