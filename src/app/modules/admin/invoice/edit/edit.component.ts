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
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectImporterComponent } from 'app/modules/common/select-importer/select-importer.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { DialogScanComponent } from 'app/modules/common/dialog-scan/dialog-scan.component';
import { InvoiceService } from '../invoice.service';

@Component({
    selector: 'app-delivery-order-edit',
    standalone: true,
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
    imports: [
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
    transports= [];
    provinces: any[] = [];
    districts: any[] = [];
    subdistricts: any[] = [];
    Id: number;
    transportBy: string;

    constructor(
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

        this.form = this.formBuilder.group({
            code: [{ value: '', disabled: true }],
            send_no: [''],
            address: [''],
            province_code: [''],
            district_code: [''],
            sub_district: [''],
            postal_code: [''],
            phone: [''],
            email: [''],
            location: [''],
            convenient_time: [''],
            credit: [''],
            estimated_arrival_date: [''],
            remark: ['']
        });
        if(this.type === 'EDIT') {
            this.form.patchValue({
                ...this.data
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
                    // if (this.type === 'EDIT') {
                    //     this.form.patchValue({
                    //         id: this.data?.id,
                    //         code: this.data?.code,
                    //         member_type: this.data?.member_type,
                    //         importer_code: this.data?.importer_code,
                    //         fname: this.data?.fname,
                    //         lname: this.data?.lname,
                    //         phone: this.data?.phone,
                    //         password: this.data?.password,
                    //         birth_date: this.data?.birth_date,
                    //         gender: this.data?.gender,
                    //         address: this.data?.address,
                    //         province: this.data?.province,
                    //         district: this.data?.district,
                    //         sub_district: this.data?.sub_district,
                    //         postal_code: this.data?.postal_code,
                    //         image: this.data?.image,
                    //         transport_thai_master_id: this.data?.detail?.transport_thai_master_id,
                    //         ever_imported_from_china: this.data?.detail?.ever_imported_from_china,
                    //         order_quantity: this.data?.detail?.order_quantity,
                    //         frequent_importer: this.data?.detail?.frequent_importer,
                    //         need_transport_type: this.data?.detail?.need_transport_type,
                    //         additional_requests: this.data?.detail?.additional_requests,
                    //         comp_name: this.data?.detail?.comp_name,
                    //         comp_tax: this.data?.detail?.comp_tax,
                    //         comp_phone: this.data?.detail?.comp_phone,
                    //         cargo_name: this.data?.detail?.cargo_name,
                    //         cargo_website: this.data?.detail?.cargo_website,
                    //         cargo_image: this.data?.detail?.cargo_image,
                    //         order_quantity_in_thai: this.data?.detail?.order_quantity_in_thai,
                    //     });
                    //     console.log('edit', this.form.value);

                    // } else {
                    //     console.log('New');
                    // }
                });
            });
        });
    }
    ngAfterViewInit() {}
    ngOnDestroy(): void {}


    Submit() {
        console.log('form', this.form.value);

        if (this.form.invalid) {
            console.log('form', this.form.value);
            this.form.markAllAsTouched();
            return;
        }

        // Format the date before submitting
        const formValue = { ...this.form.value };
        // formValue.date = new Date(formValue.date).toISOString().split('T')[0];

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
                const payload = { ...formValue };
                // if (this.type === 'NEW') {
                //     console.log('form', payload);
                //     this._service.create(payload).subscribe({
                //         next: (resp: any) => {
                //             this.toastr.success('บันทึกข้อมูลสำเร็จ');
                //             this._router.navigate(['lot']);
                //         },
                //         error: (err) => {
                //             this.toastr.error('บันทึกข้อมูลไม่สำเร็จ');
                //         },
                //     });
                // } else {
                //     this._service.update(payload, this.Id).subscribe({
                //         next: (resp: any) => {
                //             this.toastr.success('แก้ไขข้อมูลสำเร็จ');
                //             this._router.navigate(['lot']);
                //         },
                //         error: (err) => {
                //             this.toastr.error('แก้ไขข้อมูลไม่สำเร็จ');
                //         },
                //     });
                // }
                this.toastr.success('แก้ไขข้อมูลสำเร็จ');
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
