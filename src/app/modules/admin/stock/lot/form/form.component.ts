import { data } from 'jquery';
import { map, Subject, Subscription } from 'rxjs';
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
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { LotService } from '../lot.service';
import { DialogPoComponent } from '../dialog-po/dialog-po.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectImporterComponent } from 'app/modules/common/select-importer/select-importer.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { DialogScanComponent } from 'app/modules/common/dialog-scan/dialog-scan.component';

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
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatSelectModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatDatepickerModule,
        MatCheckbox,
        MatDivider,
        MatIcon,
        ImageUploadComponent,
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
        MatBadgeModule,
        SelectImporterComponent,
        SelectMemberComponent,
        UploadFileComponent,
    ],
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
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    shipping_thailand: any[] = [
        {
            id: 1,
            name: 'SHIPPING TH 1',
        },
        {
            id: 2,
            name: 'SHIPPING TH 2',
        },
    ]
    shipping_china: any[] = [
        {
            id: 1,
            name: 'SHIPPING CH 1',
        },
        {
            id: 2,
            name: 'SHIPPING CH 2',
        },
    ]
    form: FormGroup;
    type: string;

    data: any;
    lists = [];
    provinces = [];
    Id: number;
    transportBy: string;

    constructor(
        private translocoService: TranslocoService,
        private formBuilder: FormBuilder,
        public _service: LotService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.type = this.activated.snapshot.data?.type;
        this.Id = this.activated.snapshot.params?.id;
        this.data = this.activated.snapshot.data?.data?.data;
        this.form = this.formBuilder.group({
            packinglist_no: ['', Validators.required],
            container_no: ['', Validators.required],
            truck_license_plate: ['', Validators.required],
            closing_date: ['', Validators.required],
            estimated_arrival_date: ['', Validators.required],
            shipment_china: ['', Validators.required],
            shipping_thailand: ['', Validators.required],
            transport_by: ['', Validators.required],
            destination: ['', Validators.required],
            remark: [''],
        });
        if (this.type === 'EDIT') {
            this.form.patchValue({
                ...this.data,
            });
        }
    }

    ngOnInit(): void {
        this.locationService.getProvinces().subscribe((data) => {
            this.provinces = data;
        });
        this.transportBy = this.form.get('transport_by')?.value;
        if (this.type === 'NEW') {
            // this._service.getCode().subscribe((resp: any) => {
            //     this.form.patchValue({
            //         packinglist_no: resp.last_code
            //     })
            // })
        }
    }
    ngAfterViewInit() { }
    ngOnDestroy(): void { }

    onTransportByChange(value: string): void {
        this.transportBy = value;
        this.form.get('destination')?.reset();
    }

    Submit() {
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }

        // Format the date before submitting
        const formValue = {
            ...this.form.value,

        };

        formValue.packinglist_no = this.updateFullCode()

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
                const payload = { ...formValue };
                if (this.type === 'NEW') {
                    console.log('form', payload);
                    this._service.create(payload).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate(
                                    'toastr.success'
                                )
                            );
                            this._router.navigate(['lot']);
                        },
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate('toastr.error')
                            );
                        },
                    });
                } else {
                    this._service.update(payload, this.Id).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate('toastr.edit')
                            );
                            this._router.navigate(['lot']);
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

    Close() {
        this._router.navigate(['lot']);
    }

    updateFullCode() {
        const formValue = this.form.value;
        const prefix = formValue.packinglist_no;

        // --- generate suffix จากวันที่ (MMDD) ---
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const suffixDate = `${mm}${dd}`;

        // --- ตัดเลข 4 หลักท้าย + เติม 0 ด้านหน้า ถ้าไม่ครบ 4 ---
        const rawNumber = formValue.container_no || '';
        const last4 = rawNumber.slice(-4).padStart(4, '0');

        return `${prefix}-${suffixDate}-${last4}`;
    }
}
