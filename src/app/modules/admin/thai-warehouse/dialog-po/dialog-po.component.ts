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
import { map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WarehouseService } from '../warehouse.service';
import { MatDivider } from '@angular/material/divider';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import {
    MatDatepickerModule,
    MatDateRangePicker,
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
    selector: 'app-dialog-po-update-payment-new-product-form-addressed-2',
    standalone: true,
    templateUrl: './dialog-po.component.html',
    styleUrl: './dialog-po.component.scss',
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
export class DialogPoComponent implements OnInit {
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
    items: any[] = [];
    filteredItems: any[] = []; // สำหรับแสดงในตาราง
    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogPoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private http: HttpClient,
        private _service: WarehouseService
    ) {


        this.filterForm = this.FormBuilder.group({
            sack_code: [''],
            pallet_code: [''],
            code: [''],
            tracking_code: [''],
            barcode: ['']
        });
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    languageUrl: any;

    ngOnInit(): void {


        // subscribe เมื่อมีการพิมพ์ในช่องค้นหา
        this.filterForm.get('barcode')?.valueChanges.subscribe((value: any) => {
            this.applyFilter(value);
        });
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
        this.items = this.data.items
            .filter(item => item.status === 'in')
            .map(item => ({
                ...item,
                selected: false
            }));
        this.filteredItems = this.items;
        this.form = this.FormBuilder.group({
            track_no: this.FormBuilder.array([]),
        });

        if (this.data.type === 'EDIT') {
            this.form.patchValue({
                ...this.data.value,
            });
        }

        // setTimeout(() => this.loadTable());
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

    Submit() {
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }
        const formValue = this.filteredItems.filter(item => item.selected === true)
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

    loadTable(): void {
        const menuTitles = {
            tracking: {
                th: 'Tracking',
                en: 'Tracking',
                cn: '物流追踪',
            },
            outbound_scan: {
                th: 'Scan ขาออก',
                en: 'Outbound Scan',
                cn: '出库扫描',
            },
            inbound_scan: {
                th: 'Scan ขาเข้า',
                en: 'Inbound Scan',
                cn: '入库扫描',
            },
            status: {
                th: 'สถานะ',
                en: 'Status',
                cn: '状态',
            },
        };

        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            scrollX: true,
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.packing_list_id = this.data.id
                this._service
                    .datatableorderlistNotThai(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            this.dataRow = resp.data;
                            console.log(resp, 'resp');

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
                    className: 'w-5 text-center',
                },
                {
                    title: '#',
                    data: 'No',
                    className: 'w-5 text-center',
                },
                {
                    title: menuTitles.tracking[this.langues],
                    data: (row: any) => row.delivery_order?.po_no || '-',
                    className: 'text-center',
                    // ngTemplateRef: {
                    //     ref: this.date,
                    // },
                },
                {
                    title: menuTitles.outbound_scan[this.langues],
                    data: (row: any) => row.packing_list?.closing_date || '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.inbound_scan[this.langues],
                    data: (row: any) => row.packing_list?.estimated_arrival_date || '-',
                    className: 'text-center',
                },
                {
                    title: menuTitles.status[this.langues],
                    data: (row: any) => row.packing_list.status || '-',
                    className: 'text-center',
                },
            ],
        };
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

    // applyFilter() {
    //     const filterValues = this.filterForm.value;
    //     console.log(filterValues);
    //     this.rerender();
    // }
    clearFilter() {
        this.filterForm.reset();
        this.rerender();
    }

    isAllSelected(): boolean {
        return this.data.items.every(item => item.selected);
    }

    toggleAllRows(event: any): void {
        console.log(event, 'event');

        const checked = event.checked;
        this.items.forEach(item => (item.selected = checked));
    }

    toggleSingleRow(index: number): void {
        // Optional: put logic if needed when single row checkbox changes
    }

    applyFilter(value: string): void {
        const filterValue = value?.trim().toLowerCase() || '';
        if (filterValue) {
            this.filteredItems = this.items.filter(item =>
                item.barcode?.toLowerCase().includes(filterValue)
            );
        } else {
            this.filteredItems = this.items;
        }
    }
}
