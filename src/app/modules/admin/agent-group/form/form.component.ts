import { Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
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
import { AgentGroupService } from '../agent-group.service';
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
import { UploadFileComponent } from '../../../common/upload-file/upload-file.component';

export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
}

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-member-form',
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
        MatCheckbox,
        MatDivider,
        MatIcon,
        MatSelectModule,
        ImageUploadComponent,
        RouterLink,
        MatMenuModule,
        MatDividerModule,
        UploadFileComponent,
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
    form_file: FormGroup;
    dtOptions: DataTables.Settings = {};
    type: string;
    isIndividual: boolean = true;
    hidePassword = true;
    hideConfirmPassword = true;
    transport = [];

    live_provinces: any[] = [];
    live_districts: any[] = [];
    live_subdistricts: any[] = [];

    provinces: any[] = [];
    districts: any[] = [];
    subdistricts: any[] = [];

    selectedProvince: any | null = null;
    selectedDistrict: number | null = null;
    imageUrl: string;
    data: any;

    constructor(
        private FormBuilder: FormBuilder,
        public _service: AgentGroupService,
        private fuseConfirmationService: FuseConfirmationService,
        private memberService: AgentGroupService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        private dialog: MatDialog,
        private translocoService: TranslocoService
    ) {
        this.type = this.activated.snapshot.data.type;
        this.transport = this.activated.snapshot.data.transport.data;
        if (this.type === 'EDIT') {
            this.data = this.activated.snapshot.data.data.data;
        }

        this.form = this.FormBuilder.group(
            {
                member_type: ['ตัวแทน', Validators.required],
                fname: ['', Validators.required],
                lname: ['', Validators.required],
                phone: ['', Validators.required],
                confirmPassword: ['', Validators.required],
                password: ['', Validators.required],
                birth_date: ['', Validators.required],
                gender: ['', Validators.required],
                importer_code: '',
                referrer: '',
                comp_name: '',
                comp_tax: '',
                comp_phone: '',
                cargo_name: '',
                cargo_website: '',
                cargo_image: '',
                live_address: '',
                live_province: '',
                live_district: '',
                live_sub_district: '',
                live_postal_code: '',
                address: '',
                province: '',
                district: '',
                sub_district: '',
                postal_code: '',
                latitude: null,
                longitude: null,
                transport_thai_master_id: null,
                order_quantity_in_thai: '',
                order_quantity: '',
                have_any_customers: '',
                need_transport_type: '',
                additional_requests: '',
                image: '',
                image_url: '',
                // avaliable_time: 'morning',
                credit_limit: 0,
                loan_amount: 0,
                bus_route: '',
                email: '',
                facebook: '',
                line_id: '',
                wechat: '',
                // notify_sms: false,
                // notify_line: false,
                // notify_email: false,
                // found_via: '',
                // priority_update_tracking: false,
                // priority_package_protection: false,
                // priority_order_system: false,
                // responsible_person: '',
                // responsible_sale: '',
                // responsible_remark: '',
                // id_card_copy: '',
                // company_certificate: '',
                // pp20_document: '',
                language: '',
            },
            {
                validator:
                    this.type === 'NEW' ? this.passwordMatchValidator : null,
            }
        );

        this.form_file = this.FormBuilder.group({
            file: [null],
            path: ['files/asset/', Validators.required],
        });
    }

    ngOnInit(): void {
        this.locationService.getProvinces().subscribe((data) => {
            this.provinces = data;
            this.live_provinces = data;
            this.locationService.getDistricts().subscribe((data) => {
                this.districts = data;
                this.live_districts = data;
                this.locationService.getSubdistricts().subscribe((data) => {
                    this.subdistricts = data;
                    this.live_subdistricts = data;
                    if (this.type === 'EDIT') {
                        this.form.patchValue({
                            member_type: this.data.member_type,
                            fname: this.data.fname,
                            lname: this.data.lname,
                            phone: this.data.phone,
                            birth_date: this.data.birth_date,
                            gender: this.data.gender,
                            importer_code: this.data.importer_code,
                            password: this.data.password,
                            referrer: this.data.referrer,
                            live_address: this.data.address,
                            live_province: this.data.province,
                            live_district: this.data.district,
                            live_sub_district: this.data.sub_district,
                            live_postal_code: this.data.postal_code,
                            address: this.data.ship_address[0]?.address,
                            province: this.data.ship_address[0]?.province,
                            district: this.data.ship_address[0]?.district,
                            sub_district:
                                this.data.ship_address[0]?.sub_district,
                            postal_code: this.data.ship_address[0]?.postal_code,
                            credit_limit: this.data.credit_limit,
                            loan_amount: this.data.loan_amount,
                            bus_route: this.data.bus_route,
                            email: this.data.email,
                            facebook: this.data.facebook,
                            line_id: this.data.line_id,
                            wechat: this.data.wechat,
                            language: this.data.language,
                            comp_name: this.data.detail.comp_name,
                            comp_tax: this.data.detail.comp_tax,
                            comp_phone: this.data.detail.comp_phone,
                            cargo_name: this.data.detail.cargo_name,
                            cargo_website: this.data.detail.cargo_website,
                            cargo_image: this.data.detail.cargo_image,
                            transport_thai_master_id:
                                this.data.detail.transport_thai_master_id,
                            order_quantity_in_thai:
                                this.data.detail.order_quantity_in_thai,
                            order_quantity: this.data.detail.order_quantity,
                            have_any_customers:
                                this.data.detail.have_any_customers,
                            additional_requests:
                                this.data.detail.additional_requests,
                            image_url: this.data.image,
                        });
                        console.log('data', this.data.image);
                    } else {
                        console.log('New');
                    }
                });
            });
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
        // const formData = new FormData();
        // Object.entries(this.form.value).forEach(
        //     ([key, value]: any[]) => {
        //         formData.append(key, value);
        //     }
        // );
        this.form.value.birth_date = new Date(this.form.value?.birth_date)
            .toISOString()
            .split('T')[0];
        if (this.form.invalid) {
            console.log('form', this.form.value);
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
                const formData = serialize({
                    ...this.form.value,
                    id: this?.data?.id,
                });
                // const formData = this.form.value

                if (this.type === 'NEW') {
                    this.memberService.create(formData).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate(
                                    'toastr.success'
                                )
                            );
                            this._router.navigate(['agent-group']);
                        },
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate('toastr.error')
                            );
                        },
                    });
                } else {
                    this.memberService
                        .update(formData, this.data.id)
                        .subscribe({
                            next: (resp: any) => {
                                this.toastr.success(
                                    this.translocoService.translate(
                                        'toastr.edit'
                                    )
                                );
                                this._router.navigate(['agent-group']);
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

    toggleMemberType() {
        this.isIndividual = !this.isIndividual;
        this.form.patchValue({
            member_type: this.isIndividual ? 'บุคคลทั่วไป' : 'นิติบุคคล',
        });
    }

    togglePasswordVisibility(field: string) {
        if (field === 'password') {
            this.hidePassword = !this.hidePassword;
        } else if (field === 'confirmPassword') {
            this.hideConfirmPassword = !this.hideConfirmPassword;
        }
    }

    passwordMatchValidator(form: FormGroup) {
        return form.get('password').value === form.get('confirmPassword').value
            ? null
            : { mismatch: true };
    }

    Close() {
        this._router.navigate(['agent-group']);
    }

    onProvinceChange() {
        this.selectedProvince = this.form.get('province').value;
        const provinceCode = this.provinces.find(
            (s) => s.provinceNameTh === this.form.get('province').value
        ).provinceCode;

        this.locationService.getDistricts().subscribe((data) => {
            this.districts = data.filter(
                (d) => d.provinceCode === provinceCode
            );
        });
    }
    onLiveProvinceChange() {
        this.selectedProvince = this.form.get('live_province').value;
        const provinceCode = this.provinces.find(
            (s) => s.provinceNameTh === this.form.get('live_province').value
        ).provinceCode;
        console.log(provinceCode);

        this.locationService.getDistricts().subscribe((data) => {
            this.live_districts = data.filter(
                (d) => d.provinceCode === provinceCode
            );
        });
    }

    onDistrictChange() {
        this.selectedDistrict = this.form.get('district').value;

        const districtCode = this.districts.find(
            (s) => s.districtNameTh === this.form.get('district').value
        ).districtCode;

        this.locationService.getSubdistricts().subscribe((data) => {
            this.subdistricts = data.filter(
                (s) => s.districtCode === districtCode
            );
        });
    }
    onLiveDistrictChange() {
        this.selectedDistrict = this.form.get('live_district').value;

        const districtCode = this.districts.find(
            (s) => s.districtNameTh === this.form.get('live_district').value
        ).districtCode;

        this.locationService.getSubdistricts().subscribe((data) => {
            this.live_subdistricts = data.filter(
                (s) => s.districtCode === districtCode
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
    onLiveSubDistrictChange() {
        this.form.patchValue({
            live_postal_code: this.subdistricts.find(
                (s) =>
                    s.subdistrictNameTh ===
                    this.form.get('live_sub_district').value
            ).postalCode,
        });
    }
    uploadSuccess(file: File): void {
        this.form.patchValue({
            cargo_image: file,
        });
    }

    clickDeleteAddress(id: any) {
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate('confirmation.delete_title'),
            message: this.translocoService.translate(
                'confirmation.delete_message'
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
            if (result == 'confirmed') {
                this.memberService.deleteAddress(id).subscribe({
                    error: (err) => {},
                    complete: () => {
                        this.toastr.success(
                            this.translocoService.translate(
                                'toastr.del_successfully'
                            )
                        );
                    },
                });
            }
        });
    }

    onFilesChanged(files: UploadedFile[]): void {
        if (files && files.length > 0) {
            this.form_file.patchValue({
                file: files[0].file,
            });

            const formData = serialize({
                ...this.form_file.value,
            });
            console.log('file', formData);

            this._service.upload_file(formData).subscribe({
                error: (err) => {
                    this.toastr.error(
                        this.translocoService.translate('toastr.unable_to_save')
                    );
                },
                next: (res: any) => {
                    console.log('res', res);

                    this.form.patchValue({
                        cargo_image: res.path,
                    });
                },
            });
        } else {
            // Clear the image if no files
            this.form.patchValue({
                cargo_image: '',
            });
        }
    }
}
