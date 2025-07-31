import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    Validators,
    FormArray,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { debounceTime, map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { DeliveryOrdersService } from '../../delivery_orders/delivery-orders.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-dialog-update-payment-new-product-form-addressed-2',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatCheckboxModule,
    ],
})
export class DialogProductWaitComponent implements OnInit {
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    tracks = [];
    @ViewChild('checkbox') checkbox: any;

    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    @ViewChild('dt') dt: DataTableDirective;
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    dtOptions: any = {};
    datarow = [];
    searchSubject: Subject<string> = new Subject<string>();

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogProductWaitComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private http: HttpClient,
        public _service: DeliveryOrdersService
    ) {
        console.log(data, 'data');
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    languageUrl: any;

    ngOnInit(): void {
        if (this.langues === 'en') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/en-gb.json';
        } else if (this.langues === 'th') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        } else if (this.langues === 'cn') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh.json';
        } else {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        }

        setTimeout(() => this.loadTable());
        this.searchSubject.pipe(debounceTime(500)).subscribe(() => {
            this.rerender();
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }
    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
        // Also destroy the DataTable instances
    }
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }
    loadTable(): void {
        const menuTitles = {
            product_name: {
                th: 'ชื่อสินค้า',
                en: 'Product Name',
                cn: '产品名称',
            },
            product_type: {
                th: 'ประเภทสินค้า',
                en: 'Product Type',
                cn: '产品类型',
            },
            standard_size: {
                th: 'ขนาดมาตราฐาน',
                en: 'Standard Size',
                cn: '标准尺寸',
            },
        };

        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            searching: false,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                const trackingInput = (
                    document.getElementById('trackingInput') as HTMLInputElement
                ).value;
                dataTablesParameters.search.value = trackingInput; // Add search value
                this._service
                    .datataproductdraft(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            console.log('resp', resp);
                            this.datarow = resp.data;
                            callback({
                                recordsTotal: resp.total,
                                recordsFiltered: resp.total,
                                data: resp.data,
                            });
                        },
                    });
            },
            columns: [
                {
                    title: '',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.checkbox,
                    },
                    className: 'w-10 text-center',
                },
                {
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                },
                {
                    title: menuTitles.product_name[this.langues],
                    data: 'product_name',
                    className: 'text-center',
                    // ngTemplateRef: {
                    //     ref: this.date,
                    // },
                },
                {
                    title: menuTitles.product_type[this.langues],
                    data: function (row: any) {
                        if(!row.product_type?.name) {
                            return '-';
                        }
                        return row.product_type.name;
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.standard_size[this.langues],
                    data: function (row: any) {
                        return row?.standard_size?.name;
                    },
                    defaultContent: '-',
                    className: 'text-center',
                },
            ],
        };
    }

    onSearchInput(): void {
        this.searchSubject.next(
            (document.getElementById('trackingInput') as HTMLInputElement).value
        );
    }

    Submit() {
        // if (this.form.invalid) {
        //     this.toastr.error(
        //         this.translocoService.translate('toastr.missing_fields')
        //     );
        //     this.form.markAllAsTouched();
        //     return;
        // }
        const trackingInput = (
            document.getElementById('trackingInput') as HTMLInputElement
        ).value;

        if (this.multiSelect.length === 0 && trackingInput) {
            const confirmation = this.fuseConfirmationService.open({
                title: this.translocoService.translate('confirmation.confirm_add_tracking'),
                message:
                    this.translocoService.translate('confirmation.confirm_add_trackingmessage'),
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'primary',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: this.translocoService.translate(
                            'confirmation.confirm_button'
                        ),
                        color: 'primary',
                    },
                    cancel: {
                        show: true,
                        label: this.translocoService.translate(
                            'confirmation.cancel_button'
                        ),
                    },
                },
                dismissible: false,
            });

            confirmation.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    const formdata = {
                        track_no: trackingInput,
                        date: new Date().toISOString().split('T')[0],
                    };
                    this._service.createTracking(formdata).subscribe({
                        next: (response: any) => {
                            this.toastr.success(this.translocoService.translate('toastr.add'));
                            this.dialogRef.close(response.data);
                        },
                        error: (error) => {
                            this.toastr.error(
                                this.translocoService.translate('toastr.add_error')
                            );
                            console.log(error);
                        },
                    });
                }
            });
        } else {
            const confirmation = this.fuseConfirmationService.open({
                title: this.translocoService.translate('confirmation.confirm_add'),
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'primary',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: this.translocoService.translate(
                            'confirmation.confirm_button'
                        ),
                        color: 'primary',
                    },
                    cancel: {
                        show: true,
                        label: this.translocoService.translate(
                            'confirmation.cancel_button'
                        ),
                    },
                },
                dismissible: false,
            });

            confirmation.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this.dialogRef.close(this.multiSelect);
                }
            });
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    multiSelect: any[] = [];
    isAllSelected: boolean = false; // ใช้เก็บสถานะเลือกทั้งหมด

    toggleSelectAll(isAllSelected: boolean): void {
        this.isAllSelected = isAllSelected; // อัปเดตสถานะเลือกทั้งหมด

        if (isAllSelected) {
            // เลือกทั้งหมด: เพิ่ม object ของทุกแถวใน multiSelect
            this.datarow.forEach((row: any) => {
                if (!this.multiSelect.some((item) => item.id === row.id)) {
                    this.multiSelect.push(row); // เพิ่ม object ถ้ายังไม่มีใน multiSelect
                }
                row.selected = true; // ตั้งค่า selected เป็น true
            });
        } else {
            // ยกเลิกการเลือกทั้งหมด: ลบ object ของทุกแถวออกจาก multiSelect
            this.datarow.forEach((row: any) => {
                const index = this.multiSelect.findIndex(
                    (item) => item.id === row.id
                );
                if (index !== -1) {
                    this.multiSelect.splice(index, 1); // ลบ object ออกจาก multiSelect
                }
                row.selected = false; // ตั้งค่า selected เป็น false
            });
        }
    }

    onCheckboxChange(event: any, row: any): void {
        if (event.checked) {
            // เพิ่ม object เข้าไปใน multiSelect
            this.multiSelect.push(row);
        } else {
            // ลบ object ออกจาก multiSelect
            const index = this.multiSelect.findIndex(
                (item) => item.id === row.id
            );
            if (index !== -1) {
                this.multiSelect.splice(index, 1); // ใช้ splice เพื่อลบค่าออก
            }
        }
    }
}
