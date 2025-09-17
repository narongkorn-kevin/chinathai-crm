import { map, Subject, Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { MatCheckbox } from '@angular/material/checkbox';
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
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ExchangeRateService } from './exchange-rate.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-exchange-rate-form',
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
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatDivider,
        MatIcon,
        MatSelectModule,
        MatMenuModule,
        MatDividerModule
    ],
    animations: [
        trigger('slideToggle', [
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
export class FormComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    form: FormGroup;
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    dataRow: any[] = [];
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    @ViewChild('tableElement') tableElement!: ElementRef;

    type: string;
    isIndividual: boolean = true;
    hidePassword = true;
    hideConfirmPassword = true;
    transport = [];

    provinces: any[] = [];
    districts: any[] = [];
    subdistricts: any[] = [];

    selectedProvince: any | null = null;
    selectedDistrict: number | null = null;
    imageUrl: string;
    data: any;

    constructor(
        private translocoService: TranslocoService,
        private FormBuilder: FormBuilder,
        private exchangeRateService: ExchangeRateService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        private dialog: MatDialog
    ) {
        // this.type = this.activated.snapshot.data.type;
        this.data = this.activated.snapshot.data.exchange_rete.data;

        this.form = this.FormBuilder.group(
            {
                product_payment_rate: '',
                deposit_order_rate: '',
                alipay_topup_rate: '',
            }
        );
    }
    langues: any;
    languageUrl: any;
    ngOnInit(): void {
        this.langues = localStorage.getItem('lang');
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
        this.form.patchValue({
            ...this.data
        })

    }

    loadTable(): void {
        const menuTitles = {
            bill_payment_service: {
                th: 'บริการฝากชำระ',
                en: 'Payment-on-behalf service',
                cn: '代付服务',
            },
            order_proxy_service: {
                th: 'บริการฝากสั่ง',
                en: 'Order-on-behalf service',
                cn: '代购服务',
            },
            alipay_topup_service: {
                th: 'บริการเติม Alipay',
                en: 'Alipay top-up service',
                cn: '支付宝充值服务',
            },
            edited_by: {
                th: 'ผู้แก้ไข',
                en: 'Edited by',
                cn: '编辑人',
            },
            date: {
                th: 'วันที่แก้ไข',
                en: 'Change Date',
                cn: '日期',
            },


        };
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            scrollX: false,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                this.exchangeRateService
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
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                },

                {
                    title: menuTitles.bill_payment_service[this.langues],
                    data: 'product_payment_rate',
                    className: 'text-center',
                },
                {
                    title: menuTitles.order_proxy_service[this.langues],
                    data: 'deposit_order_rate',
                    className: 'text-center',
                },
                {
                    title: menuTitles.alipay_topup_service[this.langues],
                    data: 'alipay_topup_rate',
                    className: 'text-center',
                },


                {
                    title: menuTitles.edited_by[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.date[this.langues],
                    data: function (row: any) {
                        const createdAt = row.created_at
                            ? row.created_at
                            : null;

                        return createdAt
                            ? DateTime.fromISO(createdAt, { zone: 'utc' }).toLocal().toFormat('dd/MM/yyyy HH:mm')
                            : '-';
                    },
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
                    className: 'btn-csv-hidden'
                },
                {
                    extend: 'excel',
                    className: 'btn-csv-hidden'
                },
                {
                    extend: 'print',
                    className: 'btn-csv-hidden'
                },
            ]
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

    Submit() {
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }
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
                let formValue = this.form.value;
                this.exchangeRateService.update(formValue).subscribe({
                    next: (resp: any) => {
                        this.toastr.success(
                            this.translocoService.translate(
                                'toastr.success'
                            )
                        );
                        this._router.navigate(['exchange-rate']);
                        this.rerender()
                    },
                    error: (err) => {
                        this.toastr.error(
                            this.translocoService.translate('toastr.error')
                        );
                    },
                });
            }
        });
    }


    Close() {
        this._router.navigate(['exchange-rate']);
    }
}
