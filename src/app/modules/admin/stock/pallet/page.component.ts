import {
    CommonModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
} from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import {
    debounceTime,
    distinctUntilChanged,
    forkJoin,
    map,
    Subject,
} from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { PalletService } from './pallet.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CdkMenuModule } from '@angular/cdk/menu';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ExportService } from 'app/modules/shared/export.service';

@Component({
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        CdkMenuModule,
        DecimalPipe,
        ReactiveFormsModule,
        MatSelectModule,
        MatCheckboxModule,
        RouterLink
    ],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [CurrencyPipe, DecimalPipe, DatePipe],
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
export class PalletComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild('btNg') btNg: any;
    @ViewChild('textStatus') textStatus: any;
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('gotoRoute') gotoRoute: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    showAdvancedFilters: boolean = false;
    showFilters: boolean = true;
    dataRow: any[] = [];
    rows: any[] = [];
    standard_size = [];
    filterForm: FormGroup;
    showFilterForm: boolean = false;
    dashboard_pallet: any;
    @ViewChild('tableElement') tableElement!: ElementRef;
    constructor(
        private translocoService: TranslocoService,
        private http: HttpClient,
        private _service: PalletService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _router: Router,
        private FormBuilder: FormBuilder,
        private activated: ActivatedRoute,
        private exportService: ExportService,
        private datePipe: DatePipe,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.standard_size = this.activated.snapshot.data.standard_size?.data;
        this.dashboard_pallet =
            this.activated.snapshot.data.dashboard_pallet?.data;

        this.filterForm = this.FormBuilder.group({
            start_date: [''],
            end_date: [''],
            code: [''],
            shipped_by: [''],
            standard_size_id: [''],
        });
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

        this.filterForm
            .get('code')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.getDashbaordPallet();
                this.rerender();
                this._changeDetectorRef.markForCheck();
            });

        this.filterForm
            .get('start_date')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.getDashbaordPallet();
                this.rerender();
                this._changeDetectorRef.markForCheck();
            });

        this.filterForm
            .get('end_date')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.getDashbaordPallet();
                this.rerender();
                this._changeDetectorRef.markForCheck();
            });
    }
    loadTable(): void {
        const menuTitles = {
            warehouse_entry_date: {
                th: 'วันที่เข้าโกดัง',
                en: 'Warehouse Entry Date',
                cn: '入库日期',
            },
            pallet_code: {
                th: 'รหัสกระสอบ',
                en: 'Pallet Code',
                cn: '托盘编号',
            },
            shipping_type: {
                th: 'ประเภท',
                en: 'Shipping Type',
                cn: '运输类型',
                types: {
                    car: {
                        th: 'ขนส่งทางรถ',
                        en: 'Truck Transport',
                        cn: '卡车运输',
                    },
                    ship: {
                        th: 'ขนส่งทางเรือ',
                        en: 'Ship Transport',
                        cn: '船舶运输',
                    },
                    train: {
                        th: 'ขนส่งทางรถไฟ',
                        en: 'Train Transport',
                        cn: '火车运输',
                    },
                },
            },
            weight: {
                th: 'น้ำหนัก(Kg.)',
                en: 'Weight(Kg.)',
                cn: '重量(公斤)',
            },
            volume: {
                th: 'CBM',
                en: 'CBM',
                cn: '立方米',
            },
            package_count: {
                th: 'จำนวนชิ้น',
                en: 'Package Count',
                cn: '包裹数量',
            },
        };

        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            scrollX: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                if (this.filterForm.value.start_date) {
                    dataTablesParameters.created_at = this.formatDate(
                        new Date(this.filterForm.value.start_date)
                    );
                }
                if (this.filterForm.value.end_date) {
                    dataTablesParameters.end_date = this.formatDate(
                        new Date(this.filterForm.value.end_date)
                    );
                }
                if (this.filterForm.value.code) {
                    dataTablesParameters.code = this.filterForm.value.code;
                }
                if (this.filterForm.value.shipped_by) {
                    dataTablesParameters.shipped_by =
                        this.filterForm.value.shipped_by;
                }
                if (this.filterForm.value.standard_size_id) {
                    dataTablesParameters.standard_size_id =
                        this.filterForm.value.standard_size_id;
                }
                this._service
                    .datatable(dataTablesParameters)
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
                    data: 'received_date',
                    className: 'w-10 text-center',
                    // ngTemplateRef: {
                    //     ref: this.date,
                    // },
                },
                {
                    title: menuTitles.pallet_code[this.langues],
                    data: 'code',
                    className: 'text-center',
                    ngTemplateRef: { ref: this.gotoRoute },
                },
                {
                    title: menuTitles.shipping_type[this.langues],
                    data: (row: any) => {
                        if (!row.shipped_by) return '-';
                        switch (row.shipped_by) {
                            case 'Car':
                                return menuTitles.shipping_type.types.car[
                                    this.langues
                                ];
                            case 'Ship':
                                return menuTitles.shipping_type.types.ship[
                                    this.langues
                                ];
                            case 'Train':
                                return menuTitles.shipping_type.types.train[
                                    this.langues
                                ];
                            case 'car':
                                return menuTitles.shipping_type.types.car[
                                    this.langues
                                ];
                            case 'ship':
                                return menuTitles.shipping_type.types.ship[
                                    this.langues
                                ];
                            case 'train':
                                return menuTitles.shipping_type.types.train[
                                    this.langues
                                ];
                            default:
                                return row.shipped_by;
                        }
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.weight[this.langues],
                    data: (row: any) => row.total_weight || 0,
                    className: 'text-center',
                },
                {
                    title: menuTitles.volume[this.langues],
                    data: function (row: any) {
                        if (!row?.total_cbm) {
                            return '0.000';
                        }
                        return Number(row.total_cbm).toFixed(4);
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.package_count[this.langues],
                    data: (row: any) => row.total_qty || 0,
                    className: 'text-center',
                },
            ],
            // Declare the use of the extension in the dom parameter
            dom: 'lfrtip',
            buttons: [
                {
                    extend: 'copy',
                    className: 'btn-csv-hidden'
                },
                {
                    extend: 'csv',
                    className: 'btn-csv-hidden',
                },
                {
                    extend: 'excel',
                    className: 'btn-csv-hidden',
                },
                {
                    extend: 'print',
                    className: 'btn-csv-hidden',
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

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }

    goToPalletForm() {
        this._router.navigate(['/pallet-form']);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    multiSelect: any[] = [];
    isAllSelected: boolean = false; // ใช้เก็บสถานะเลือกทั้งหมด

    toggleSelectAll(isSelectAll: boolean): void {
        this.isAllSelected = isSelectAll; // อัปเดตสถานะเลือกทั้งหมด

        if (isSelectAll) {
            // เลือกทั้งหมด: เพิ่ม id ของทุกแถวใน multiSelect
            this.dataRow.forEach((row: any) => {
                if (!this.multiSelect.includes(row.id)) {
                    this.multiSelect.push(row.id); // เพิ่ม id ถ้ายังไม่มีใน multiSelect
                }
                row.selected = true; // ตั้งค่า selected เป็น true
            });
        } else {
            // ยกเลิกการเลือกทั้งหมด: ลบ id ของทุกแถวออกจาก multiSelect
            this.dataRow.forEach((row: any) => {
                const index = this.multiSelect.indexOf(row.id);
                if (index !== -1) {
                    this.multiSelect.splice(index, 1); // ลบ id ออกจาก multiSelect
                }
                row.selected = false; // ตั้งค่า selected เป็น false
            });
        }
    }
    onCheckboxChange(event: any, id: number): void {
        if (event.checked) {
            // เพิ่ม id เข้าไปใน multiSelect
            this.multiSelect.push(id);
        } else {
            // ลบ id ออกจาก multiSelect
            const index = this.multiSelect.indexOf(id);
            if (index !== -1) {
                this.multiSelect.splice(index, 1); // ใช้ splice เพื่อลบค่าออก
            }
        }
    }
    opendialogdelete() {
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate(
                'confirmation.delete_title2'
            ),
            message: this.translocoService.translate(
                'confirmation.delete_message2'
            ),
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
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
            // if (result == 'confirmed') {
            //     const id = this.multiSelect;
            //     console.log(id, 'id');

            //     for (let i = 0; i < id.length; i++) {
            //         this._service.delete(id[i]).subscribe({
            //             error: (err) => {
            //                 this.toastr.error(
            //                     'ลบรายการสมาชิก ล้มเหลว โปรดลองใหม่อีกครั้งภายหลัง'
            //                 );
            //                 console.log(err, 'err');
            //             },
            //             complete: () => {
            //                 if (i == id.length - 1) {
            //                     this.multiSelect = [];
            //                     this.toastr.success(this.translocoService.translate('toastr.delete'));
            //                     this.rerender();
            //                 }
            //             },
            //         });
            //     }
            //     if (id.length === 1) {
            //         this.rerender();
            //     }
            // }
            if (result == 'confirmed') {
                const id = this.multiSelect;
                console.log(id, 'id');

                const deleteRequests = id.map((itemId) =>
                    this._service.delete(itemId)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.delete')
                        );
                        this.multiSelect = [];
                        this.rerender();
                    },
                    error: (err) => {
                        this.toastr.error(
                            'ลบรายการสมาชิก ล้มเหลว โปรดลองใหม่อีกครั้งภายหลัง'
                        );
                        console.log(err, 'err');
                        this.rerender();
                    },
                });
            }
        });
    }

    openfillter() {
        this.showFilterForm = !this.showFilterForm;

    }

    applyFilter() {
        const filterValues = this.filterForm.value;
        this.getDashbaordPallet();
        this.rerender();
    }

    clearFilter() {
        this.filterForm.reset();
        this.getDashbaordPallet();
        this.rerender();
    }

    openForm() {
        this._router.navigate(['pallet/form']);
    }

    exportData(type: 'csv' | 'excel' | 'print' | 'copy') {
        this.exportService.exportTable(this.tableElement, type);
    }

    formatDate(date: Date): string {
        // กำหนด timezone เป็น 'Asia/Bangkok' หรือ timezone ที่ต้องการ
        return this.datePipe.transform(date, 'yyyy-MM-dd', 'Asia/Bangkok');
    }

    getDashbaordPallet() {
        const formValue = this.filterForm.value;
        // ตรวจสอบว่า start_date มีค่าหรือไม่
        if (formValue.start_date) {
            formValue.start_date = this.formatDate(new Date(formValue.start_date));
        }

        // ตรวจสอบว่า end_date มีค่าหรือไม่
        if (formValue.end_date) {
            formValue.end_date = this.formatDate(new Date(formValue.end_date));
        }
        const params: any = {};
        Object.keys(formValue).forEach(key => {
            if (formValue[key] !== null && formValue[key] !== '') {
                params[key] = formValue[key];
            }
        });
        this._service.getDashboardPalletFilter(params).subscribe({
            next: (resp: any) => {
                this.dashboard_pallet = resp.data;
                this._changeDetectorRef.markForCheck();
            }
        })
    }

    onFilterChange() {
        this.getDashbaordPallet();
        this.rerender();
    }

}
