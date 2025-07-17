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
import { forkJoin, map, Subject } from 'rxjs';
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
import { LotService } from './lot.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CdkMenuModule } from '@angular/cdk/menu';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { DialogAllComponent } from './dialog-all/dialog-all.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ExportService } from 'app/modules/shared/export.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
    templateUrl: './lot.component.html',
    styleUrl: './lot.component.scss',
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
export class SackComponent implements OnInit, AfterViewInit {
selectMember($event: any) {
throw new Error('Method not implemented.');
}
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild('btNg') btNg: any;
    @ViewChild('textStatus') textStatus: any;
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('gotoRoute') gotoRoute: any;
    @ViewChild('transpot') transpot: any;
    @ViewChild('statusshipment') statusshipment: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    showAdvancedFilters: boolean = false;
    showFilters: boolean = true;
    dataRow: any[] = [];
    rows: any[] = [];
    standard_size = [];
    packing_list = [];
    dashboard_packing: any;

    private isRerendering = false;

    filterForm: FormGroup;
    showFilterForm: boolean = false;
    @ViewChild('tableElement') tableElement!: ElementRef;
    constructor(
        private translocoService: TranslocoService,
        private http: HttpClient,
        private _service: LotService,
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
        this.packing_list = this.activated.snapshot.data.packing_list?.data;
        this.dashboard_packing =
            this.activated.snapshot.data.dashboard_packing?.data;
        // console.log(this.dashboard_packing);

        this.filterForm = this.FormBuilder.group({
            start_date: [''],
            end_date: [''],
            code: [''],
            packinglist_no: [''],
            po_code: [''],
            member_code: [''],
            container_no: [''],
            transport_by: [''],
            status: [''],
        });
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    memberFilter = new FormControl('');
    
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
            .get('packinglist_no')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.getDashbaordPacking();
                this.rerender();
            });

        this.filterForm
            .get('start_date')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.getDashbaordPacking();
                this.rerender();
            });

        this.filterForm
            .get('end_date')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.getDashbaordPacking();
                this.rerender();
            });
    }
    loadTable(): void {
        const menuTitles = {
            creation_date: {
                th: 'วันที่สร้าง',
                en: 'Creation Date',
                cn: '创建日期',
            },
            packing_list: {
                th: 'Packing List',
                en: 'Packing List',
                cn: '装箱单',
            },
            customer: {
                th: 'ลูกค้า',
                en: 'Customer',
                cn: '客户',
            },
            container_number: {
                th: 'เลขตู้',
                en: 'Container Number',
                cn: '集装箱号',
            },
            truck_license: {
                th: 'ทะเบียนรถ',
                en: 'Truck License Plate',
                cn: '车牌号',
            },
            china_shipping: {
                th: 'Shipping จีน',
                en: 'China Shipping',
                cn: '中国运输',
            },
            shipped_by: {
                th: 'ขนส่งโดย',
                en: 'Shipped By',
                cn: '运输方式',
            },
            destination: {
                th: 'ปลายทาง',
                en: 'Destination',
                cn: '目的地',
            },
            thai_arrival: {
                th: 'กำหนกการถึงไทย',
                en: 'Estimated Arrival in Thailand',
                cn: '预计到达泰国日期',
            },
            weight: {
                th: 'น้ำหนัก (Kg.)',
                en: 'Weight (Kg.)',
                cn: '重量 (公斤)',
            },
            cbm: {
                th: 'CBM',
                en: 'CBM',
                cn: '立方米',
            },
            qty_box: {
                th: 'จำนวนกล่อง',
                en: 'Box Quantity',
                cn: '箱数',
            },
            shipping_status: {
                th: 'สถานะการขนส่ง',
                en: 'Shipping Status',
                cn: '运输状态',
            },
        };

        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            // scrollX: true,
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
                if (this.filterForm.value.packinglist_no) {
                    dataTablesParameters.packinglist_no = this.filterForm.value.packinglist_no;
                }
                if (this.filterForm.value.packinglist_no) {
                    dataTablesParameters.packinglist_no =
                        this.filterForm.value.packinglist_no;
                }
                if (this.filterForm.value.po_code) {
                    dataTablesParameters.po_code = this.filterForm.value.po_code;
                }
                // if (this.filterForm.value.member_code) {
                //     dataTablesParameters.member_code =
                //         this.filterForm.value.member_code;
                // }
                if (this.filterForm.value.container_no) {
                    dataTablesParameters.container_no =
                        this.filterForm.value.container_no;
                }
                if (this.filterForm.value.transport_by) {
                    dataTablesParameters.transport_by =
                        this.filterForm.value.transport_by;
                }
                if (this.filterForm.value.status) {
                    dataTablesParameters.status = this.filterForm.value.status;
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
                    title: menuTitles.creation_date[this.langues],
                    data: function (row: any) {
                        if (!row?.created_at) {
                            return '-';
                        }
                        const date = new Date(row.created_at);
                        const year = date.getFullYear();
                        const month = ('0' + (date.getMonth() + 1)).slice(-2);
                        const day = ('0' + date.getDate()).slice(-2);
                        return `${year}/${month}/${day}`;
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.packing_list[this.langues],
                    data: null,
                    className: 'w-10 text-center',
                    ngTemplateRef: {
                        ref: this.gotoRoute,
                    },
                },
                {
                    title: menuTitles.container_number[this.langues],
                    data: 'container_no',
                    className: 'text-center',
                },
                {
                    title: menuTitles.truck_license[this.langues],
                    data: 'truck_license_plate',
                    className: 'text-center',
                },
                {
                    title: menuTitles.china_shipping[this.langues],
                    data: 'shipping_china',
                    className: 'text-center',
                },
                {
                    title: menuTitles.shipped_by[this.langues],
                    data: null,
                    ngTemplateRef: {
                        ref: this.transpot,
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.destination[this.langues],
                    data: 'destination',
                    className: 'text-center',
                },
                {
                    title: menuTitles.thai_arrival[this.langues],
                    data: 'estimated_arrival_date',
                    className: 'text-center',
                },
                {
                    title: menuTitles.weight[this.langues],
                    data: function (row: any) {
                        if (!row?.total_weight) {
                            return 0
                        }
                        return row?.total_weight;
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.cbm[this.langues],
                    data: function (row: any) {
                        if (!row?.total_packing_cbm) {
                            return '0.000';
                        }
                        return Number(row.total_packing_cbm).toFixed(4);
                    },
                    className: 'text-center',
                },

                {
                    title: menuTitles.qty_box[this.langues],
                    data: function (row: any) {
                        if (!row?.total_qty_box) {
                            return 0;
                        }
                        return row?.total_qty_box;
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.shipping_status[this.langues],
                    data: 'status',
                    ngTemplateRef: {
                        ref: this.statusshipment,
                    },
                    defaultContent: 0,
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
        if (this.isRerendering) {
            console.log('rerender: already in progress, skip');
            return; // ถ้ากำลัง rerender อยู่แล้วให้ข้าม
        }
        this.isRerendering = true;

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next(null);
            this.isRerendering = false;
        }).catch(error => {
            console.error('rerender error:', error);
            this.isRerendering = false;
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

     onSelectMember(event: any) {
        if (!event) {
            if (this.memberFilter.invalid) {
                this.memberFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No Member Selected');
            return;
        }

        const selectedData = event; // event จะเป็นออบเจ็กต์ item

        if (selectedData) {
            this.filterForm.patchValue({
                member: selectedData.code,
            });
            this.memberFilter.setValue(
                `[ ${selectedData.code} ] ${selectedData.fname} ${selectedData.lname}`
            );
        } else {
            if (this.memberFilter.invalid) {
                this.memberFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No Member Found');
            return;
        }
    }
    selectMember2(item: any) {
        this.filterForm.patchValue({
            member_id: item?.id,
        });
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
        this.getDashbaordPacking();
        this.rerender();
    }
    clearFilter() {
        this.filterForm.reset();
        this.getDashbaordPacking();
        this.rerender();
    }
    openForm() {
        this._router.navigate(['lot/form']);
    }

    openDialogall() {
        const DialogRef = this.dialog.open(DialogAllComponent, {
            disableClose: true,
            width: '50%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                packing_list: this.packing_list,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.rerender();
            }
        });
    }

    exportData(type: 'csv' | 'excel' | 'print' | 'copy') {
        this.exportService.exportTable(this.tableElement, type);
    }
    formatDate(date: Date): string {
        // กำหนด timezone เป็น 'Asia/Bangkok' หรือ timezone ที่ต้องการ
        return this.datePipe.transform(date, 'yyyy-MM-dd', 'Asia/Bangkok');
    }

    getDashbaordPacking() {
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
        this._service.getDashboardPackingFilter(params).subscribe({
            next: (resp: any) => {
                this.dashboard_packing = resp.data;
            },
            error: (err) => {
                console.error('Error fetching dashboard packing:', err);
            },
        });
    }
}
