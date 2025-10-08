import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LocationService } from 'app/location.service';

type Province = {
    provinceCode: string;
    provinceNameTh: string;
};

type District = {
    districtCode: string;
    districtNameTh: string;
    provinceCode: string;
};

type Subdistrict = {
    subdistrictCode: string;
    subdistrictNameTh: string;
    districtCode: string;
    postalCode: string;
};

@Component({
    selector: 'app-member-register',
    standalone: true,
    templateUrl: './member-register.component.html',
    styleUrls: ['./member-register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        RouterLink,
    ],
})
export class MemberRegisterComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    private readonly fb = inject(FormBuilder);
    private readonly http = inject(HttpClient);
    private readonly snackBar = inject(MatSnackBar);
    private readonly locationService = inject(LocationService);

    registerForm: FormGroup;
    isSubmitting = false;

    provinces: Province[] = [];
    districts: District[] = [];
    subdistricts: Subdistrict[] = [];

    filteredDistricts: District[] = [];
    filteredSubdistricts: Subdistrict[] = [];

    hidePassword = true;
    hideConfirmPassword = true;

    ngOnInit(): void {
        this.initForm();
        this.loadLocationData();
    }

    private initForm(): void {
        this.registerForm = this.fb.group(
            {
                member_type: ['บุคคลทั่วไป'],
                email: ['', [Validators.required, Validators.email]],
                importer_code: ['', Validators.required],
                password: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', Validators.required],
                fname: ['', Validators.required],
                lname: ['', Validators.required],
                line_id: [''],
                phone: ['', Validators.required],
                recommend_code: [''],
                referrer: [''],
                address: ['', Validators.required],
                tax_id: ['',],
                gender: ['male', ],
                province: ['', Validators.required],
                district: ['', Validators.required],
                sub_district: ['', Validators.required],
                postal_code: ['', Validators.required],
                agreements: [false, Validators.requiredTrue],
            },
            { validators: this.passwordMatchValidator },
        );
    }

    private passwordMatchValidator(group: FormGroup): null | { mismatch: boolean } {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        if (!password || !confirmPassword) {
            return null;
        }
        return password === confirmPassword ? null : { mismatch: true };
    }

    private loadLocationData(): void {
        this.locationService.getProvinces().subscribe((provinces: Province[]) => {
            this.provinces = provinces;
        });

        this.locationService.getDistricts().subscribe((districts: District[]) => {
            this.districts = districts;
        });

        this.locationService.getSubdistricts().subscribe((subdistricts: Subdistrict[]) => {
            this.subdistricts = subdistricts;
        });
    }

    onProvinceChange(): void {
        const selectedProvince = this.registerForm.get('province')?.value as string;
        if (!selectedProvince) {
            this.filteredDistricts = [];
            this.filteredSubdistricts = [];
            return;
        }

        const province = this.provinces.find(
            (item) => item.provinceNameTh === selectedProvince,
        );

        this.filteredDistricts = province
            ? this.districts.filter((district) => district.provinceCode === province.provinceCode)
            : [];

        this.filteredSubdistricts = [];
        this.registerForm.patchValue({
            district: '',
            sub_district: '',
            postal_code: '',
        });
    }

    onDistrictChange(): void {
        const selectedDistrict = this.registerForm.get('district')?.value as string;
        if (!selectedDistrict) {
            this.filteredSubdistricts = [];
            return;
        }

        const district = this.districts.find(
            (item) => item.districtNameTh === selectedDistrict,
        );

        this.filteredSubdistricts = district
            ? this.subdistricts.filter(
                (subdistrict) => subdistrict.districtCode === district.districtCode,
            )
            : [];

        this.registerForm.patchValue({
            sub_district: '',
            postal_code: '',
        });
    }

    onSubDistrictChange(): void {
        const selectedSubDistrict = this.registerForm.get('sub_district')?.value as string;
        if (!selectedSubDistrict) {
            this.registerForm.patchValue({ postal_code: '' });
            return;
        }

        const subdistrict = this.subdistricts.find(
            (item) => item.subdistrictNameTh === selectedSubDistrict,
        );

        this.registerForm.patchValue({
            postal_code: subdistrict?.postalCode ?? '',
        });
    }

    togglePassword(field: 'password' | 'confirmPassword'): void {
        if (field === 'password') {
            this.hidePassword = !this.hidePassword;
        } else {
            this.hideConfirmPassword = !this.hideConfirmPassword;
        }
    }

    submit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        const formValue = this.registerForm.getRawValue();
        const payload: Record<string, any> = {
            member_type: 'บุคคลทั่วไป',
            email: formValue.email,
            importer_code: formValue.importer_code,
            password: formValue.password,
            fname: formValue.fname,
            lname: formValue.lname,
            phone: formValue.phone,
            address: formValue.address,
            province: formValue.province,
            district: formValue.district,
            sub_district: formValue.sub_district,
            postal_code: formValue.postal_code,
            tax_id: formValue.tax_id,
            gender: formValue.gender,
            line_id: formValue.line_id ?? '',
        };

        if (formValue.referrer) {
            payload.referrer = formValue.referrer;
        }

        if (formValue.recommend_code) {
            payload.recommend_code = formValue.recommend_code;
        }

        if (formValue.tax_id) {
            payload.tax_id = formValue.tax_id;
        }

        if (formValue.gender) {
            payload.gender = formValue.gender;
        }

        this.isSubmitting = true;
        this.http.post('/api/member', payload)
            .pipe(finalize(() => {
                this.isSubmitting = false;
            }))
            .subscribe({
                next: () => {
                    this.snackBar.open('ลงทะเบียนสำเร็จ', 'ปิด', { duration: 3000 });
                    this.registerForm.reset({
                        member_type: 'บุคคลทั่วไป',
                        agreements: false,
                    });
                    this.filteredDistricts = [];
                    this.filteredSubdistricts = [];
                },
                error: (error) => {
                    const message = error?.error?.message ?? 'ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง';
                    this.snackBar.open(message, 'ปิด', { duration: 4000 });
                },
            });
    }
}
