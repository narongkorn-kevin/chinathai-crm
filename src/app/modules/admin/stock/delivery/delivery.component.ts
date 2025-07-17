import {
    CommonModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
} from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
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
import { DeliveryService } from './delivery.service';
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
        RouterLink,
        SelectMemberComponent,
    ],
    templateUrl: './delivery.component.html',
    styleUrl: './delivery.component.scss',
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
export class DeliveryComponent implements OnInit, AfterViewInit {
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
    @ViewChild('tableElement') tableElement!: ElementRef;
    constructor(
        private translocoService: TranslocoService,
        private http: HttpClient,
        private _service: DeliveryService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _router: Router,
        private FormBuilder: FormBuilder,
        private activated: ActivatedRoute,
        private exportService: ExportService,
        private datePipe: DatePipe
    ) {
        this.standard_size = this.activated.snapshot.data.standard_size?.data;

        this.filterForm = this.FormBuilder.group({
            start_date: [''],
            end_date: [''],
            code: [''],
            delivery_orders_code: [''],
            status: [''],
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
                this.rerender();
            });

        this.filterForm
            .get('start_date')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.rerender();
            });

        this.filterForm
            .get('end_date')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.rerender();
            });
    }
    loadTable(): void {
        const menuTitles = {
            warehouse_entry_date: {
                th: 'วันที่เข้าโกดัง',
                en: 'Warehouse Entry Date',
                cn: '入库日期',
            },
            shipment_no: {
                th: 'Shipment No',
                en: 'Shipment No',
                cn: '货运编号',
            },
            status: {
                th: 'สถานะ',
                en: 'Status',
                cn: '状态',
                status_mapping: {
                    waiting_in_process: {
                        th: 'รอดำเนินการ',
                        en: 'Pending',
                        cn: '待处理',
                    },
                    in_store: {
                        th: 'รับเข้าคลัง',
                        en: 'In Warehouse',
                        cn: '已入库',
                    },
                },
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
                    dataTablesParameters.start_date = this.formatDate(
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
                if (this.filterForm.value.delivery_orders_code) {
                    dataTablesParameters.delivery_orders_code =
                        this.filterForm.value.delivery_orders_code;
                }
                if (this.filterForm.value.status) {
                    dataTablesParameters.status = this.filterForm.value.status;
                }
                this._service
                    .datatablepo(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            console.log('API Response:', resp);
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
                // {
                //     title: '',
                //     data: null,
                //     defaultContent: '',
                //     ngTemplateRef: {
                //         ref: this.checkbox,
                //     },
                //     className: 'w-10 text-center',
                // },
                {
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                },
                {
                    title: menuTitles.warehouse_entry_date[this.langues],
                    data: 'date',
                    className: 'text-center',
                },
                {
                    title: menuTitles.shipment_no[this.langues],
                    data: 'code',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.gotoRoute,
                    },
                },
                {
                    title: menuTitles.status[this.langues],
                    data: function (row: any) {
                        if (!row.status) {
                            return '-';
                        }
                        if (row.status == 'waiting_in_process') {
                            return menuTitles.status.status_mapping
                                .waiting_in_process[this.langues];
                        } else if (row.status == 'in_store') {
                            return menuTitles.status.status_mapping.in_store[
                                this.langues
                            ];
                        } else {
                            return '-';
                        }
                    }.bind(this),
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
            //                 this.rerender();
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
        console.log(filterValues);
        this.rerender();
    }

    clearFilter() {
        this.filterForm.reset();
        this.rerender();
    }

    openForm() {
        this._router.navigate(['delivery/form']);
    }

    setting() {
        this._router.navigate(['delivery/settings']);
    }

    exportData(type: 'csv' | 'excel' | 'print' | 'copy') {
        this.exportService.exportTable(this.tableElement, type);
    }

    formatDate(date: Date): string {
        // กำหนด timezone เป็น 'Asia/Bangkok' หรือ timezone ที่ต้องการ
        return this.datePipe.transform(date, 'yyyy-MM-dd', 'Asia/Bangkok');
    }
}
