import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
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
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PalletService } from '../pallet.service';
import { MatDivider } from '@angular/material/divider';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import {
    MatDatepickerModule,
} from '@angular/material/datepicker';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-dialog-item-none-pallet-sack-update-payment-new-product-form-addressed-18',
    standalone: true,
    templateUrl: './dialog-item-none-pallet-sack.component.html',
    styleUrl: './dialog-item-none-pallet-sack.component.scss',
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
        MatDivider,
        MatDatepickerModule,
    ],
    animations: [
        trigger('slideToggleFilter', [
            state(
                'open',
                style({
                    height: '*',
                    opacity: 1,
                    overflow: 'hidden',
                })
            ),
            state(
                'closed',
                style({
                    height: '0px',
                    opacity: 0,
                    overflow: 'hidden',
                })
            ),
            transition('open <=> closed', [animate('300ms ease-in-out')]),
        ]),
    ],
})
export class DialogItemNonePalletSackComponent implements OnInit {
    @ViewChild('checkbox') checkbox: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: any = {};
    addForm: FormGroup;
    tracks = [];
    dataRow: any[] = [];

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogItemNonePalletSackComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private http: HttpClient,
        private _service: PalletService,
        private formBuilder: FormBuilder
    ) {
        this.filterForm = this.FormBuilder.group({
            start_date: [''],
            end_date: [''],
            in_store: [''],
            barcode: [''],
            sack_code: [''],
            member_code: [''],
            shipment: [''],
        });
        console.log(this.data, 'data');
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    languageUrl: any;

    ngOnInit(): void {
        if (this.langues === 'en') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/en-gb.json';
        } else if (this.langues === 'cn') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh.json';
        } else {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        }

        this.form = this.FormBuilder.group({
            track_no: this.FormBuilder.array([]),
        });

        if (this.data.type === 'EDIT') {
            this.form.patchValue({
                ...this.data.value,
            });
        }

        this.updateFormArray();

        setTimeout(() => this.loadTable());
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

    get trackNoArray(): FormArray {
        return this.form.get('track_no') as FormArray;
    }

    updateFormArray(): void {
        this.trackNoArray.clear();
        this.selectedTrackings.forEach((trackingNumber) => {
            this.trackNoArray.push(this.FormBuilder.control(trackingNumber));
        });
    }

    Submit() {
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }
        const formValue = this.multiSelect;

        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate('confirmation.save_title'),
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
                this.dialogRef.close(formValue);
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    trackingItems = [

    ];

    get selectedTrackings(): string[] {
        return this.trackingItems
            .filter((item) => item.selected)
            .map((item) => item.trackingNumber);
    }

    toggleAll(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;
        this.trackingItems.forEach((item) => (item.selected = checked));
        this.updateFormArray();
    }

    updateSelection(): void {
        const allSelected = this.trackingItems.every((item) => item.selected);
        (document.getElementById('selectAll') as HTMLInputElement).checked =
            allSelected;
        this.updateFormArray();
    }

    loadTable(): void {
        const menuTitles = {
            warehouse_entry_date: {
                th: 'วันที่เข้าโกดัง',
                en: 'Warehouse Entry Date',
                cn: '入库日期',
            },
            sack_number: {
                th: 'หมายเลขกระสอบ',
                en: 'Sack Number',
                cn: '麻袋编号',
            },
            warehouse_receipt_code: {
                th: 'รหัสใบรับเข้าคลัง',
                en: 'Warehouse Receipt Code',
                cn: '入库单号',
            },
            barcode_number: {
                th: 'เลขที่บาร์โค้ด',
                en: 'Barcode Number',
                cn: '条码编号',
            },
            customer_code: {
                th: 'รหัสลูกค้า',
                en: 'Customer Code',
                cn: '客户代码',
            },
            shipped_by: {
                th: 'ขนส่งโดย',
                en: 'Shipped By',
                cn: '运输方式',
            },
        };

        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            scrollX: true,
            pageLength: 1000,    // ✅ จำกัดจำนวนแถวต่อหน้า
            lengthMenu: [50, 100, 500, 1000],
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.product_type_id = this.data?.value?.product_type_id
                dataTablesParameters.shipment_by = this.data?.value?.shipped_by
                this._service
                    .datatableorderlistBox(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            this.dataRow = resp.data;
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
                    ngTemplateRef: { ref: this.checkbox },
                    className: 'w-10 text-center',
                },
                {
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                },
                {
                    title: menuTitles.warehouse_entry_date[this.langues],
                    data: (row: any) => row.delivery_order?.date || '-',
                    className: 'w-10 text-center',
                },
                {
                    title: menuTitles.sack_number[this.langues],
                    data: (row: any) => row.sack?.code || '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.warehouse_receipt_code[this.langues],
                    data: (row: any) => row.delivery_order?.po_no || '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.barcode_number[this.langues],
                    data: (row: any) => row?.barcode || '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.customer_code[this.langues],
                    data: (row: any) => row.delivery_order?.member?.importer_code || '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.shipped_by[this.langues],
                    data: (row: any) => this.getShipmentMethod(row.delivery_order?.shipment_by) || '-',
                    className: 'text-center',
                },
            ],
        };
    }

    getShipmentMethod(shippedBy: string): string {
        if (shippedBy === 'Car' || shippedBy === 'car') {
            return 'ขนส่งทางรถ';
        } else if (shippedBy === 'Ship' || shippedBy === 'ship') {
            return 'ขนส่งทางเรือ';
        } else if (shippedBy === 'Train' || shippedBy === 'train') {
            return 'ขนส่งทางรถไฟ';
        } else {
            return '-';
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

    multiSelect: any[] = [];
    isAllSelected: boolean = false; // ใช้เก็บสถานะเลือกทั้งหมด

    toggleSelectAll(isSelectAll: boolean): void {
        this.isAllSelected = isSelectAll; // อัปเดตสถานะเลือกทั้งหมด

        if (isSelectAll) {
            // เลือกทั้งหมด: เพิ่ม object ของทุกแถวใน multiSelect
            this.dataRow.forEach((row: any) => {
                if (!this.multiSelect.some((item) => item.id === row.id)) {
                    this.multiSelect.push(row); // เพิ่ม object ถ้ายังไม่มีใน multiSelect
                }
                row.selected = true; // ตั้งค่า selected เป็น true
            });
        } else {
            // ยกเลิกการเลือกทั้งหมด: ลบ object ของทุกแถวออกจาก multiSelect
            this.dataRow.forEach((row: any) => {
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

    filterForm: FormGroup;
    showFilterForm: boolean = false;
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
}
