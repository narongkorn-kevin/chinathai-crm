// dialog-setting.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DeliveryOrdersService } from '../delivery-orders.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-shipment-dialog',
    templateUrl: './dialog-address.component.html',
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatDatepickerModule,
        MatDialogModule,
        TranslocoModule,
    ],
})
export class DialogAddressComponent implements OnInit {
    form: FormGroup;
    labelForm: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    constructor(
        private dialogRef: MatDialogRef<DialogAddressComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private http: HttpClient,
        private fuseConfirmationService: FuseConfirmationService,
        private _service: DeliveryOrdersService,
        private toastr: ToastrService,
        private _router: Router,
        private translocoService: TranslocoService
    ) {
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;
    languageUrl: any;

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [''],
            address: [''],
            phone: [''],
        });

    }
    submitData() {
        if (this.form.valid) {
            const confirmation = this.fuseConfirmationService.open({
                title: this.translocoService.translate('confirmation.save_title'),
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
                    this.labelForm = this.fb.group({
                        labels: this.fb.array(this.createLabels(this.data.length)),
                    });

                    this._service.createAdress(this.labelForm.value).subscribe({
                        next: (blob: Blob) => {
                            const fileURL = URL.createObjectURL(blob);
                            window.open(fileURL); // เปิด PDF ใน tab ใหม่

                            this.toastr.success(this.translocoService.translate('toastr.success'));
                            this.dialogRef.close(); // ปิด dialog หลังเปิด PDF
                        },
                        error: (err) => {
                            this.toastr.error(this.translocoService.translate('toastr.error'));
                        },
                    });
                }
            });
        }
    }

    formatDate(dateString: string): string {
        return new Date(dateString)
            .toISOString()
            .replace('T', ' ')
            .split('.')[0];
    }

    closeDialog() {
        this.dialogRef.close();
    }

    createLabels(count: number): FormGroup[] {
        let formValue = this.form.value
        const labels = [];
        for (let i = 0; i < count; i++) {
            labels.push(this.fb.group({
                from_name: ['TEG Cargo', Validators.required],
                from_phone: ['0987654321', Validators.required],
                from_address: ['เลขที่ 123/45 อาคารกดสอบ ชั้น 10\nถนนพหลโยธิน แขวงจตุจักร\nเขตจตุจักร กรุงเทพมหานคร 10900', Validators.required],
                to_name: formValue.name,
                to_phone: formValue.phone,
                to_address: formValue.address,
            }));
        }
        return labels;
    }
}
