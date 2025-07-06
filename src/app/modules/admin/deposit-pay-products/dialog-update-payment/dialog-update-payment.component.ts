import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
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
import { OrderProductsService } from '../../order-products/order-products.service';
import { UploadedFile } from '../form-dialog/dialog.component';
import { MatDivider } from '@angular/material/divider';
@Component({
    selector: 'app-dialog-update-payment-new-product-form-addressed-1',
    standalone: true,
    templateUrl: './dialog-update-payment.component.html',
    styleUrl: './dialog-update-payment.component.scss',
    imports: [CommonModule, DataTablesModule, MatIconModule, MatFormFieldModule, MatInputModule,
    FormsModule, MatToolbarModule,
    MatButtonModule,
    MatDialogActions,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDivider
]
})
export class DialogUpdatePaymentComponent implements OnInit {

    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};

    order: any;
    type: string;
    uploadedFiles: UploadedFile[] = [];

    constructor(
        private dialogRef: MatDialogRef<DialogUpdatePaymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private service: OrderProductsService
    ) {
        this.order = data.order
        this.type = data.type

        this.form = this.FormBuilder.group({
            payment_type: ['upload'],
            member_id: this.order?.member_id,
            ref_no: this.order?.code,
            date: new Date(),
            total_price: +this.order?.total_price,
            note: null,
            image: null,
            order_type: ['order']
        });
    }

    ngOnInit(): void {
    }

    uploadImage() {
        return new Promise((resolve, reject) => {
            const file = this.uploadedFiles[0]?.file;

            if (!file) {
                reject(new Error("No file selected"));
                return;
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('path', 'images/asset/');

            this.service.upload(formData).subscribe({
                next: (resp: any) => resolve(resp),
                error: (err: any) => reject(err)
            });
        });
    }


    Submit() {
        if (this.form.invalid) {
            return
        }

        const confirmation = this.fuseConfirmationService.open({
            title: "ยืนยันการบันทึกข้อมูล",
            icon: {
                show: true,
                name: "heroicons_outline:exclamation-triangle",
                color: "primary"
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
            async result => {
                if (result == 'confirmed') {
                    const slip: any = await this.uploadImage();

                    const formValue = {
                        ...this.form.value,
                        image: slip?.data
                    }

                    this.service.paymentOrder(formValue).subscribe({
                        error: (err) => {
                            this.toastr.error(err?.error?.message ?? 'ไม่สามารถบันทึกข้อมูลได้')
                        },
                        complete: () => {
                            this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')
                            this.dialogRef.close(true)
                        },
                    });
                }
            }
        )
    }

    onClose() {
        this.dialogRef.close()
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
                    });
                };
                reader.readAsDataURL(file);
            });
        }
    }
    removeFile(index: number): void {
        this.uploadedFiles.splice(index, 1);
    }
}
