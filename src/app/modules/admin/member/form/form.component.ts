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
import { MemberService } from '../member.service';
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
import { DialogAddressFormComponent } from '../dialog-form-address/dialog-address.component';

@Component({
    selector: 'app-member-form',
    standalone: true,
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
    imports: [
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
    dtOptions: DataTables.Settings = {};
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
        private FormBuilder: FormBuilder,
        public _service: MemberService,
        private fuseConfirmationService: FuseConfirmationService,
        private memberService: MemberService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        private dialog: MatDialog
    ) {
        this.type = this.activated.snapshot.data.type;
        this.transport = this.activated.snapshot.data.transport.data;
        if (this.type === 'EDIT') {
            this.data = this.activated.snapshot.data.data.data;
        }
        console.log(this.data)

        this.form = this.FormBuilder.group(
            {
                referrer: null,
                id: [''],
                member_type: ['บุคคลทั่วไป', Validators.required],
                importer_code: ['', Validators.required],
                fname: ['', Validators.required],
                lname: ['', Validators.required],
                phone: ['', Validators.required],
                // ============= new field ==============
                customer_code: [''],
                username: [''],
                bank: [''],
                bank_name: [''],
                bank_no: [''],
                bookbank: [''],
                // ============= new field ==============
                password: [''],
                confirmPassword: [''],
                birth_date: ['', Validators.required],
                gender: ['', Validators.required],
                address: ['', Validators.required],
                province: ['', Validators.required],
                district: ['', Validators.required],
                sub_district: ['', Validators.required],
                postal_code: ['', Validators.required],
                image: [null],
                transport_thai_master_id: '',
                ever_imported_from_china: 'เคย', //เอาจากแบบสอบถามหน้าสมัคร
                order_quantity: '50', //เอาจากแบบสอบถามหน้าสมัคร
                frequent_importer: 'ไม่บ่อย', //เอาจากแบบสอบถามหน้าสมัคร
                need_transport_type: 'Express', //เอาจากแบบสอบถามหน้าสมัคร
                additional_requests: 'Deliver with extra care', //เอาจากแบบสอบถามหน้าสมัคร

                //============ นิติบุคคล ============

                comp_name: [''],
                comp_tax: [''],
                comp_phone: [''],

                //======== ตัวแทน ============
                cargo_name: [''],
                cargo_website: [''],
                cargo_image: [null],
                order_quantity_in_thai: '150',//เอาจากแบบสอบถามหน้าสมัคร
undertaker: '',
                province_code: [''],
                district_code: [''],
                second_bookbank: [''],

                avaliable_time: '',
                credit_limit: '',
                loan_amount: '',
                bus_route: '',
                email: '',
                facebook: '',
                line_id: '',
                wechat: '',
                notify_sms: false,
                notify_line: false,
                notify_email: false,
                found_via: 'facebook',
                priority_update_tracking: false,
                priority_package_protection: false,
                priority_order_system: false,
                responsible_person: '',
                responsible_sale: '',
                responsible_remark: '',
                language: '',
            },
            { validator: this.passwordMatchValidator }
        );
    }

    ngOnInit(): void {


        this.form.get('member_type').valueChanges.subscribe((value) => {
            if (value === 'นิติบุคคล' || value === 'ตัวแทน') {
                this.form.get('comp_name').setValidators([Validators.required]);
                this.form.get('comp_tax').setValidators([Validators.required]);
                this.form.get('comp_phone').setValidators([Validators.required]);

                if (value === 'ตัวแทน') {
                    this.form.get('cargo_name').setValidators([Validators.required]);
                    this.form.get('cargo_website').setValidators([Validators.required]);
                    this.form.get('cargo_image').setValidators([Validators.required]);
                } else {
                    this.form.get('cargo_name').clearValidators();
                    this.form.get('cargo_website').clearValidators();
                    this.form.get('cargo_image').clearValidators();
                }
            } else {
                this.form.get('comp_name').clearValidators();
                this.form.get('comp_tax').clearValidators();
                this.form.get('comp_phone').clearValidators();
                this.form.get('cargo_name').clearValidators();
                this.form.get('cargo_website').clearValidators();
                this.form.get('cargo_image').clearValidators();
            }
            this.form.get('comp_name').updateValueAndValidity();
            this.form.get('comp_tax').updateValueAndValidity();
            this.form.get('comp_phone').updateValueAndValidity();
            this.form.get('cargo_name').updateValueAndValidity();
            this.form.get('cargo_website').updateValueAndValidity();
            this.form.get('cargo_image').updateValueAndValidity();
        });

        // this.locationService.getProvinces().subscribe((data) => {
        //     this.provinces = data;
        //     this.locationService.getDistricts().subscribe((data) => {
        //         this.districts = data;
        //         this.locationService.getSubdistricts().subscribe((data) => {
        //             this.subdistricts = data;
        //             if (this.type === 'EDIT') {
        //                 this.form.patchValue({
        //                     id: this.data?.id,
        //                     code: this.data?.code,
        //                     member_type: this.data?.member_type,
        //                     importer_code: this.data?.importer_code,
        //                     fname: this.data?.fname,
        //                     lname: this.data?.lname,
        //                     phone: this.data?.phone,
        //                     password: this.data?.password,
        //                     birth_date: this.data?.birth_date,
        //                     gender: this.data?.gender,
        //                     address: this.data?.address,
        //                     province: this.data?.province,
        //                     district: this.data?.district,
        //                     sub_district: this.data?.sub_district,
        //                     postal_code: this.data?.postal_code,
        //                     image: this.data?.image,
        //                     transport_thai_master_id: this.data?.detail?.transport_thai_master_id,
        //                     ever_imported_from_china: this.data?.detail?.ever_imported_from_china,
        //                     order_quantity: this.data?.detail?.order_quantity,
        //                     frequent_importer: this.data?.detail?.frequent_importer,
        //                     need_transport_type: this.data?.detail?.need_transport_type,
        //                     additional_requests: this.data?.detail?.additional_requests,
        //                     comp_name: this.data?.detail?.comp_name,
        //                     comp_tax: this.data?.detail?.comp_tax,
        //                     comp_phone: this.data?.detail?.comp_phone,
        //                     cargo_name: this.data?.detail?.cargo_name,
        //                     cargo_website: this.data?.detail?.cargo_website,
        //                     cargo_image: this.data?.detail?.cargo_image,
        //                     order_quantity_in_thai: this.data?.detail?.order_quantity_in_thai,
        //                 });
        //                 console.log('edit', this.form.value);

        //             } else {
        //                 console.log('New');
        //             }
        //         });
        //     });
        // });



    }

    Submit() {
        this.form.value.birth_date = new Date(this.form.value.birth_date)
            .toISOString()
            .split('T')[0];
        if (this.form.invalid) {
            console.log('form', this.form.value);

            this.form.markAllAsTouched();
            return;
        }

        const confirmation = this.fuseConfirmationService.open({
            title: 'ยืนยันการบันทึกข้อมูล',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'primary',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const formData = serialize({
                    ...this.form.value,
                    id: this?.data?.value?.id,
                });
                if (this.type === 'NEW') {
                    this.memberService.create(formData).subscribe({
                        next: (resp: any) => {
                            this.toastr.success('บันทึกข้อมูลสำเร็จ');
                            this._router.navigate(['member']);
                        },
                        error: (err) => {
                            this.toastr.error('บันทึกข้อมูลไม่สำเร็จ');
                        },
                    });
                } else {
                    this.memberService.update(this.form.value).subscribe({
                        next: (resp: any) => {
                            this.toastr.success('แก้ไขข้อมูลสำเร็จ');
                            this._router.navigate(['member']);
                        },
                        error: (err) => {
                            this.toastr.error('แก้ไขข้อมูลไม่สำเร็จ');
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
        this._router.navigate(['member']);
    }

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
    uploadSuccess(file: File): void {
        this.form.patchValue({
            cargo_image: file,
        });
    }

    openDialogEdit(item: any) {
        const DialogRef = this.dialog.open(DialogAddressFormComponent, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            data: {
                type: 'EDIT',
                member_id: this.data,
                shipAddress: item
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    openDialogNew() {
        const DialogRef = this.dialog.open(DialogAddressFormComponent, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            data: {
                type: 'NEW',
                member_id: this.data,
                shipAddress: ''
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.memberService.get(this.data.id).subscribe((resp: any) => {
                    this.data = resp.data
                    this.form.patchValue({
                        id: this.data?.id,
                        code: this.data?.code,
                        member_type: this.data?.member_type,
                        importer_code: this.data?.importer_code,
                        fname: this.data?.fname,
                        lname: this.data?.lname,
                        phone: this.data?.phone,
                        password: this.data?.password,
                        birth_date: this.data?.birth_date,
                        gender: this.data?.gender,
                        address: this.data?.address,
                        province: this.data?.province,
                        district: this.data?.district,
                        sub_district: this.data?.sub_district,
                        postal_code: this.data?.postal_code,
                        image: this.data?.image,
                        transport_thai_master_id: this.data?.detail?.transport_thai_master_id,
                        ever_imported_from_china: this.data?.detail?.ever_imported_from_china,
                        order_quantity: this.data?.detail?.order_quantity,
                        frequent_importer: this.data?.detail?.frequent_importer,
                        need_transport_type: this.data?.detail?.need_transport_type,
                        additional_requests: this.data?.detail?.additional_requests,
                        comp_name: this.data?.detail?.comp_name,
                        comp_tax: this.data?.detail?.comp_tax,
                        comp_phone: this.data?.detail?.comp_phone,
                        cargo_name: this.data?.detail?.cargo_name,
                        cargo_website: this.data?.detail?.cargo_website,
                        cargo_image: this.data?.detail?.cargo_image,
                        order_quantity_in_thai: this.data?.detail?.order_quantity_in_thai,
                    });

                })
            }
        });
    }


    clickDeleteAddress(id: any) {
        const confirmation = this.fuseConfirmationService.open({
            title: "ยืนยันลบข้อมูล",
            message: "กรุณาตรวจสอบข้อมูล หากลบข้อมูลแล้วจะไม่สามารถนำกลับมาได้",
            icon: {
                show: true,
                name: "heroicons_outline:exclamation-triangle",
                color: "warn"
            },
            actions: {
                confirm: {
                    show: true,
                    label: "ยืนยัน",
                    color: "primary"
                },
                cancel: {
                    show: true,
                    label: "ยกเลิก"
                }
            },
            dismissible: false
        })

        confirmation.afterClosed().subscribe(
            result => {
                if (result == 'confirmed') {
                    this.memberService.deleteAddress(id).subscribe({
                        error: (err) => {

                        },
                        complete: () => {
                            this.toastr.success('ดำเนินการลบสำเร็จ');

                        },
                    });
                }
            }
        )
    }
}
