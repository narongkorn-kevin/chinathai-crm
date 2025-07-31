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
    EmailValidator,
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
    selector: 'app-delivery-order-edit',
    standalone: true,
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
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
export class EditComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    form: FormGroup;
    type: string;

    data: any;
    lists = [];
    transports = [];
    provinces: any[] = [];
    districts: any[] = [];
    subdistricts: any[] = [];
    Id: number;
    transportBy: string;

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
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.type = this.activated.snapshot.data?.type;
        this.Id = this.activated.snapshot.params?.id;
        this.data = this.activated.snapshot.data?.data?.data;
        this.transports = this.activated.snapshot.data?.transports?.data;
        console.log(this.data, 'data');
        
        this.form = this.formBuilder.group({
            member_code: [{ value: '' }],
            bill_no: [''],
            address: [''],
            province_code: [''],
            district_code: [''],
            sub_district: [''],
            postal_code: [''],
            phone: [''],
            email: [''],
            location: [''],
            convenient_time: [''],
            credit_limit: [''],
            loan_amount: [''],
            estimated_arrival_date: [''],
            remark: [''],
        });
        if (this.type === 'EDIT') {
            this.form.patchValue({
                member_code: this.data?.member?.importer_code,
                bill_no: this.data?.code,
                address : this.data?.member_address?.address,
                province_code: this.data?.member_address?.province,
                district_code: this.data?.member_address?.district,
                sub_district: this.data?.member_address?.sub_district,  
                postal_code: this.data?.member_address?.postal_code,  
                phone: this.data?.member_address?.contact_phone,  
                email: this.data?.member?.email,  
                convenient_time: this.data?.member?.avaliable_time,  
                credit_limit: this.data?.member?.credit_limit,  
                loan_amount: this.data?.member?.loan_amount,  
                remark: this.data?.member?.remark,  
            });
        }
    }

    ngOnInit(): void {
        this.locationService.getProvinces().subscribe((data) => {
            this.provinces = data;
            this.locationService.getDistricts().subscribe((data) => {
                this.districts = data;
                this.locationService.getSubdistricts().subscribe((data) => {
                    this.subdistricts = data;
                });
            });
        });
    }
    ngAfterViewInit() {}
    ngOnDestroy(): void {}

    Submit() {
        // Format the date before submitting
        const formValue = { ...this.form.value };
        // formValue.date = new Date(formValue.date).toISOString().split('T')[0];

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
                            this.toastr.success(this.translocoService.translate('toastr.success'));
                            this._router.navigate(['lot']);
                        },
                        error: (err) => {
                            this.toastr.error(this.translocoService.translate('toastr.error'));
                        },
                    });
                } else {
                    this._service.update(payload, this.Id).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(this.translocoService.translate('toastr.edit'));
                            this._router.navigate(['lot']);
                        },
                        error: (err) => {
                            this.toastr.error(this.translocoService.translate('toastr.edit_error'));
                        },
                    });
                }
                this.toastr.success(
                    this.translocoService.translate('toastr.edit')
                );
                this._router.navigate(['invoice/view/' + this.Id]);
            }
        });
    }

    Close() {
        this._router.navigate(['invoice/view/' + this.Id]);
    }

    selectedProvince: any | null = null;
    selectedDistrict: number | null = null;
    onProvinceChange() {
        this.selectedDistrict = null;
        this.subdistricts = [];
        this.selectedProvince = this.form.get('province_code').value;
        this.form.patchValue({
            province: this.provinces.find(
                (s) => s.provinceCode === this.form.get('province_code').value
            ).provinceNameTh,
        });

        this.locationService.getDistricts().subscribe((data) => {
            this.districts = data.filter(
                (d) => d.provinceCode === this.selectedProvince
            );
        });
    }

    onDistrictChange() {
        this.selectedDistrict = this.form.get('district_code').value;
        this.form.patchValue({
            district: this.districts.find(
                (s) => s.districtCode === this.form.get('district_code').value
            ).districtNameTh,
        });
        this.locationService.getSubdistricts().subscribe((data) => {
            this.subdistricts = data.filter(
                (s) => s.districtCode === this.selectedDistrict
            );
        });
    }
    onSubDistrictChange() {
        this.form.patchValue({
            postal_code: this.subdistricts.find(
                (s) =>
                    s.subdistrictNameTh === this.form.get('sub_district').value
            ).postalCode,
        });
    }
}
