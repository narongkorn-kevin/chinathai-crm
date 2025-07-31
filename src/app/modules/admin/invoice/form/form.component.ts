import { data } from 'jquery';
import {
    debounceTime,
    map,
    ReplaySubject,
    Subject,
    Subscription,
    takeUntil,
} from 'rxjs';
import {
    Component,
    OnInit,
    OnChanges,
    Inject,
    ChangeDetectorRef,
    ViewChild,
    ChangeDetectionStrategy,
    AfterViewInit,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    Validators,
    FormArray,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { CreditService } from '../credit.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    MatDatepicker,
    MatDatepickerModule,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { LocationService } from 'app/location.service';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { serialize } from 'object-to-formdata';
// import { DialogStockInComponent } from '../../dialog/dialog-stock-in/dialog.component';
import { MatTableModule } from '@angular/material/table';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectImporterComponent } from 'app/modules/common/select-importer/select-importer.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { DialogScanComponent } from 'app/modules/common/dialog-scan/dialog-scan.component';
import { InvoiceService } from '../invoice.service';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-delivery-order-form',
    standalone: true,
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
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
        MatRadioModule,
        MatDatepickerModule,
        RouterLink,
        MatTableModule,
        MatCheckboxModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
        CdkMenuModule,
        MatTabsModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatBadgeModule
    ],
    providers: [DecimalPipe],
    changeDetection: ChangeDetectionStrategy.Default,
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
export class FormComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    @ViewChild('checkbox') checkbox: any;

    form: FormGroup;
    type: string;

    data: any;
    lists = [];
    transports = [];
    provinces = [];
    Id: number;
    transportBy: string;
    dataRow: any[] = [];

    packinglistFilter = new FormControl('');
    filterpackinglist: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    packing_list: any[] = [];
    selectedPackingListData: any = null;

    constructor(
        private translocoService: TranslocoService,
        private formBuilder: FormBuilder,
        public _service: InvoiceService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private decimalPipe: DecimalPipe
    ) {
        this.type = this.activated.snapshot.data?.type;
        this.Id = this.activated.snapshot.params?.id;
        this.data = this.activated.snapshot.data?.data?.data;
        this.packing_list = this.activated.snapshot.data?.packing_list?.data;
        this.filterpackinglist.next(this.packing_list.slice());

        this.form = this.formBuilder.group({
            packing_list_id: [''],
            in_thai_date: ['', Validators.required],
            address: [''],
            total_vat: [''],
            total_amount: [''],
            client_type: [''],
            note: [''],
            transportation_channel: [''],
            billing_lists: this.formBuilder.array([]),

        });
        this.langues = localStorage.getItem('lang');
    }
    transportOptions = ['EK', 'SEA', 'FL', 'RW', 'AW', 'FK']; // เพิ่ม FK ตามข้อมูลที่คุณมี
    langues: any;
    languageUrl: any;

    protected _onDestroy = new Subject<void>();

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
        this.form.valueChanges.pipe(debounceTime(600)).subscribe(() => {
            // this.rerender();
        });

        this.packinglistFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterpackinglist();
            });
    }



    loadTable(): void {
        const menuTitles = {
            warehouse_receipt_code: {
                th: 'รหัสใบรับเข้าคลัง',
                en: 'Warehouse Receipt Code',
                cn: '入库单号',
            },
            packing_list: {
                th: 'Packing list',
                en: 'Packing List',
                cn: '装箱单',
            },
            customer: {
                th: 'ลูกค้า',
                en: 'Customer',
                cn: '客户',
            },
            total_expense: {
                th: 'ค่าใช้จ่ายรวม',
                en: 'Total Expense',
                cn: '总费用',
            },
            china_side_expense: {
                th: 'ค่าใช้จ่ายฝั่งจีน',
                en: 'China Side Expense',
                cn: '中国方费用',
            },
            credit: {
                th: 'เครดิต',
                en: 'Credit',
                cn: '信用额度',
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
                dataTablesParameters.packing_list_id =
                    this.form.value.packing_list_id;
                this._service
                    .datatablepo(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            // Process the nested data structure
                            let flattenedData = [];
                            resp.data.forEach((item) => {
                                // เพิ่มข้อมูลจาก delivery_order_thai_lists แต่ละรายการ
                                if (
                                    item.delivery_order_thai_lists &&
                                    item.delivery_order_thai_lists.length > 0
                                ) {
                                    item.delivery_order_thai_lists.forEach(
                                        (listItem, index) => {
                                            // เก็บข้อมูลทั้งหมดของ delivery_order_thai_lists แต่ละรายการ
                                            flattenedData.push({
                                                ...listItem,
                                                parent_id: item.id,
                                                parent_code: item.code,
                                                parent_date: item.date,
                                                parent_status: item.status,
                                                parent_packing_list:
                                                    item.packing_list,
                                                No: index + 1,
                                            });
                                        }
                                    );
                                }
                            });

                            this.dataRow = flattenedData;
                            console.log('flattenedData:', flattenedData);

                            callback({
                                recordsTotal: resp.total,
                                recordsFiltered: resp.total,
                                data: flattenedData,
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
                    title: menuTitles.warehouse_receipt_code[this.langues],
                    data: 'parent_code',
                    className: 'text-center',
                },
                {
                    title: menuTitles.packing_list[this.langues],
                    data: function (row: any) {
                        return row.parent_packing_list?.code;
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.customer[this.langues],
                    data: function (row: any) {
                        return (
                            row.delivery_order?.member?.fname +
                            ' ' +
                            row.delivery_order?.member?.lname
                        );
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.total_expense[this.langues],
                    data: function (row: any) {
                        return row.delivery_order?.order?.total_price;
                    },
                    className: 'text-center',
                    render: (data: string) => {
                        return this.decimalPipe.transform(data, '1.2-2');
                    },
                },
                {
                    title: menuTitles.china_side_expense[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.credit[this.langues],
                    data: 'create_by',
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

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    Submit() {
        if (this.form.invalid) {
            console.log('form', this.form.value);
            this.toastr.error(this.translocoService.translate('toastr.missing_fields'));
            this.form.markAllAsTouched();
            return;
        }

        const payload = {
            in_thai_date: this.form.get('in_thai_date').value,
            transportation_channel: [this.form.get('transportation_channel').value],
            billing_lists: this.groupedTableData.map(item => ({
                member_id: item.delivery_order.member_id,
                member_address_id: item.delivery_order.order.member_address_id,
                delivery_order_list_id: item.delivery_order_list_id,
                delivery_order_thai_list_id: item.delivery_order_thai_list_id,
                delivery_order_thai_id: item.delivery_order_thai_id,
            })),
            // เพิ่ม fields อื่นๆ ที่จำเป็นต้องส่งไป API
            packing_list_id: this.form.get('packing_list_id').value,
            address: this.form.get('address').value,
            customer_type: this.form.get('client_type').value,
            note: this.form.get('note').value,
        };

        console.log(payload);
        return;



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
                if (this.type === 'NEW') {
                    let formValue = this.form.value;
                    console.log('Sending payload:', formValue);
              
                    this._service.create(formValue).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate(
                                    'toastr.success'
                                )
                            );
                            // this._router.navigate(['invoice/edit/' + resp.data.id]);
                            this._router.navigate(['invoice']);
                        },
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate('toastr.error')
                            );
                        },
                    });
                } else {
                    let formValue = this.form.value;
                    this._service.update(formValue, this.Id).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate('toastr.edit')
                            );
                            this._router.navigate(['invoice']);
                        },
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate(
                                    'toastr.edit_error'
                                )
                            );
                        },
                    });
                }
            }
        });
    }

    protected _filterpackinglist() {
        if (!this.packing_list) {
            return;
        }
        let search = this.packinglistFilter.value;

        if (!search) {
            this.filterpackinglist.next(this.packing_list.slice());
            return;
        } else {
            search = search.toString().toLowerCase();
        }

        this.filterpackinglist.next(
            this.packing_list.filter((item) =>
                item.code.toLowerCase().includes(search)
            )
        );
    }
    onSelectpackinglist(event: any) {
        if (!event) {
            if (this.packinglistFilter.invalid) {
                this.packinglistFilter.markAsTouched();
            }
            return;
        }

        const selectedData = event;
        if (selectedData) {
            this.form.patchValue({
                packing_list_id: selectedData.id,
                in_thai_date: selectedData.estimated_arrival_date,
                note: selectedData.remark
            });

            const billingArray = this.form.get('billing_lists') as FormArray;

            // เคลียร์ข้อมูลเก่า
            billingArray.clear();

            // เพิ่มรายการใหม่
            if (selectedData.delivery_order_thais) {
                selectedData.delivery_order_thais.forEach(orderThai => {
                    orderThai.delivery_order_thai_list.forEach(item => {
                        const formGroup = this.formBuilder.group({
                            member_id: item?.member_id,
                            member_address_id: item?.member_address_id,
                            delivery_order_list_id: [item?.delivery_order_list_id],
                            delivery_order_thai_list_id: [item?.id],
                            delivery_order_thai_id: [orderThai?.id]
                        });
                        billingArray.push(formGroup);
                    });
                });
            }

            // Set selected packing list for table display
            this.selectedPackingListData = selectedData;
            // If packing_list_order_lists is missing, try to use another property (including typo 'packling_list_order_lists')
            if (!this.selectedPackingListData.packing_list_order_lists) {
                if (this.selectedPackingListData.packling_list_order_lists) {
                    this.selectedPackingListData.packing_list_order_lists = this.selectedPackingListData.packling_list_order_lists;
                } else if (this.selectedPackingListData.packingListOrderLists) {
                    this.selectedPackingListData.packing_list_order_lists = this.selectedPackingListData.packingListOrderLists;
                }
            }
            this._changeDetectorRef.detectChanges();

            this.packinglistFilter.setValue(`${selectedData.packinglist_no}`);
        } else {
            if (this.packinglistFilter.invalid) {
                this.packinglistFilter.markAsTouched();
            }
            console.log('No packing list Found');
            return;
        }
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


    get groupedTableData() {
        const lists = this.selectedPackingListData?.packing_list_order_lists || this.data?.packing_list_order_lists || [];
        const seen = new Set<string>();
        const uniqueByPO: any[] = [];
        for (const item of lists) {
            const po_no = item?.delivery_order?.po_no || '-';
            if (!seen.has(po_no)) {
                seen.add(po_no);
                uniqueByPO.push(item);
            }
        }
        return uniqueByPO;
    }


    Close() {
        this._router.navigate(['invoice']);
    }




}
