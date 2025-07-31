import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogActions,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { UploadedFile } from '../dialog-stock-in/dialog.component';
import { OrderProductsService } from '../../order-products/order-products.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-dialog-update-payment-product-form-addressed',
    standalone: true,
    templateUrl: './dialog-update-payment.component.html',
    styleUrl: './dialog-update-payment.component.scss',
    imports: [
        TranslocoModule,
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogActions,
        MatSelectModule,
        ReactiveFormsModule,
        MatRadioModule,
    ],
})
export class DialogUpdatePaymentComponent implements OnInit {
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};

    order: any;

    uploadedFiles: UploadedFile[] = [];

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogUpdatePaymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { order: any },
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private service: OrderProductsService
    ) {
        this.order = data.order;
        this.form = this.FormBuilder.group({
            payment_type: ['upload'],
            member_id: this.order.member_id,
            ref_no: this.order.code,
            date: this.formatDateForDatetimeLocal(this.order?.order_payment?.date),
            total_price: +this.order.total_price,
            note: null,
            image: null,
            image_url: null,
            order_type: ['order'],
        });
    }

    ngOnInit(): void {
        console.log(this.order, 'order');
        
        // map ให้กลายเป็นรูปแบบเดียวกับ uploadedFiles
        if (this.order?.order_payment?.image) {
            const url = this.order.order_payment.image;
            const fileName = url.split('/').pop() || '';

            this.uploadedFiles = [
                {
                    file: null,         // ← ใส่ตรงนี้เพื่อให้ตรงกับ interface
                    name: fileName,
                    size: 200,
                    imagePreview: url,
                    fromAPI: true,
                }
            ];
        } else {
            this.uploadedFiles = [];
        }




    }

    formatDateForDatetimeLocal(rawDate: string | null | undefined): string | null {
        if (!rawDate) return null; // ถ้าเป็น null, undefined หรือ '' ให้ return null
    
        if (rawDate.includes('T')) {
            // เคสแบบ full ISO เช่น 2025-04-15T08:06:32.000000Z
            return DateTime.fromISO(rawDate, { zone: 'utc' })
                .setZone('local')
                .toFormat("yyyy-MM-dd'T'HH:mm");
        } else {
            // เคสแบบไม่มีเวลา เช่น 2025-01-20
            return DateTime.fromISO(rawDate)
                .toFormat("yyyy-MM-dd'T'00:00");
        }
    }
    
    uploadImage() {
        return new Promise((resolve, reject) => {
            const file = this.uploadedFiles[0]?.file;

            if (!file) {
                reject(new Error('No file selected'));
                return;
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('path', 'images/asset/');

            this.service.upload(formData).subscribe({
                next: (resp: any) => resolve(resp),
                error: (err: any) => reject(err),
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

        confirmation.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                const slip: any = await this.uploadImage();

                const formValue = {
                    ...this.form.value,
                    image: slip?.data,
                };

                this.service.paymentOrder(formValue).subscribe({
                    error: (err) => {
                        this.toastr.error(
                            err?.error?.message ?? 'ไม่สามารถบันทึกข้อมูลได้'
                        );
                    },
                    complete: () => {
                        this.toastr.success(
                            this.translocoService.translate(
                                'toastr.data_addition_successful'
                            )
                        );
                        this.dialogRef.close(true);
                    },
                });
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    onFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            Array.from(input.files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    this.uploadedFiles.push({
                        file,
                        name: file.name,
                        size: Math.round(file.size / 1024),
                        imagePreview: reader.result as string,
                        fromAPI: false,
                    });
                };
                reader.readAsDataURL(file);
            });
        }
    }

    get total() {
        return this.order?.order_lists.reduce((acc, curr) => {
            let rate = 1;
            if (this.order?.exchange_rate != curr.rate) {
                rate = this.order?.exchange_rate;
            } 


            return acc + (+curr.product_real_price * +curr.product_qty * +rate);
        }, 0);
    }
}
