import { activities } from './../../../../mock-api/pages/activities/data';
import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    Validators,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute } from '@angular/router';
import { DeliveryOrdersService } from '../../delivery_orders/delivery-orders.service';
import { HttpClient } from '@angular/common/http';


export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
    fromAPI: boolean;
}

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { environment } from 'environments/environment';
import { calculateCBM } from 'app/helper';
import { UtilityService } from 'app/utility.service';

@Component({
    selector: 'app-dialog-stock-in',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
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
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
    ],
})
export class DialogStockInComponent implements OnInit {
    form: FormGroup;
    formEdit: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    uploadForm: FormGroup;
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    fileSize: number = 0;
    uploadedFiles: UploadedFile[] = [];
    allImages = [];
    product_type = [];
    standard_size = [];
    unit = [];
    packing_type = [];

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogStockInComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private activated: ActivatedRoute,
        public _service: DeliveryOrdersService,
        private http: HttpClient,
        private el: ElementRef,
        private utilityService: UtilityService,
    ) {
        this.product_type = this.data.product_type;
        this.standard_size = this.data.standard_size;
        this.unit = this.data.unit;
        this.packing_type = this.data.packing_type;
        this.allImages = [this.data.images];
    }

    ngOnInit(): void {
        this.uploadForm = this.FormBuilder.group({});
        this.form = this.FormBuilder.group({
            product_type_id: [null, Validators.required],
            product_name: [''],
            product_logo: [''],
            standard_size_id: [null],
            unit_id: [null],
            weight: [null, [Validators.required, Validators.min(1)]],  // 👈 ตรงนี้
            width: [null, [Validators.required, Validators.min(1)]],  // 👈 ตรงนี้
            height: [null, [Validators.required, Validators.min(1)]],  // 👈 ตรงนี้
            long: [null, [Validators.required, Validators.min(1)]],  // 👈 ตรงนี้
            qty: [null, [Validators.required, Validators.min(1)]],  // 👈 ตรงนี้
            qty_box: [null, [Validators.required, Validators.min(1)]],  // 👈 ตรงนี้
            image_url: '',
            images: this.FormBuilder.array([]),
            code: '',
            po_no: '',
            seq: '',
            product_draft_id: '',
            delivery_order_tracking_id: '',
            delivery_order_id: '',
            product_image: '',
        });
        if (this.data.product_type_id) {
            this.form.patchValue({
                product_type_id: this.data.product_type_id,
            });
        }

        if (this.data.type === 'EDIT') {
            console.log(this.data.value, 'data.value');

            this.form.patchValue({
                ...this.data.value,
            });
        }
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

    removeFile(index: number): void {
        this.uploadedFiles.splice(index, 1);
    }

    Submit() {
        if (
            this.form.invalid ||
            !this.form.value.qty_box ||
            !this.form.value.weight ||
            !this.form.value.width ||
            !this.form.value.height ||
            !this.form.value.long
        ) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();

            const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');
            if (invalidControl) {
                invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            return;
        }
        const uploadObservables = this.uploadedFiles.map((file) => {
            const formData = new FormData();
            formData.append('image', file.file);
            formData.append('path', 'images/asset/');
            return this.http
                .post<{ data: string }>('/api/upload_images', formData)
                .toPromise();
        });
        console.log(uploadObservables, 'uploadObservables');
        Promise.all(uploadObservables)
            .then((responses) => {
                const images = responses.map((response) => ({
                    image: response.data,
                    image_url: response.data,
                }));

                // ดึงรูปเดิมที่เคย patchValue ไว้แล้ว
                const existingImages = this.form.value.images || [];

                // รวมภาพเดิม + ใหม่
                const mergedImages = existingImages.concat(images);

                const formValue = {
                    ...this.form.value,
                    cbm: calculateCBM(
                        +this.form.value.width,
                        +this.form.value.height,
                        +this.form.value.long,
                        +this.form.value.qty_box
                    ),
                    images: mergedImages

                };


                const confirmation = this.fuseConfirmationService.open({
                    title: this.translocoService.translate(
                        'confirmation.save_title'
                    ),
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
                        console.log(formValue, 'formValue');


                        let apiCall;

                        if (this.data.type !== 'EDIT' && !formValue.delivery_order_id) {
                            // กรณีที่ไม่ใช่ EDIT และไม่มี delivery_order_id → create ใหม่
                            apiCall = this._service.createpo(formValue);
                        } else if (this.data.type === 'EDIT' && formValue.delivery_order_id) {
                            // กรณี EDIT และมี delivery_order_id → update ของจริง
                            apiCall = this._service.updateproductpo(formValue, this.data.value.id);
                        } else if (this.data.type === 'EDIT' && !formValue.delivery_order_id) {
                            // กรณี EDIT และไม่มี delivery_order_id → update draft
                            this.toastr.success(
                                this.translocoService.translate(
                                    'toastr.data_addition_successful'
                                )
                            );
                            this.dialogRef.close({
                                data: formValue,
                                form: formValue
                            });
                        }
                        apiCall.subscribe({
                            error: (err) => {
                                this.toastr.error(
                                    this.translocoService.translate(
                                        'toastr.unable_to_save'
                                    )
                                );
                            },
                            next: (res: any) => {
                                this.toastr.success(
                                    this.translocoService.translate(
                                        'toastr.data_addition_successful'
                                    )
                                );
                                this.dialogRef.close({
                                    data: res.data,
                                    form: formValue
                                });
                            },
                        });
                    }
                });
            })
            .catch(() => {
                this.toastr.error(
                    this.translocoService.translate(
                        'toastr.unable_to_upload_image'
                    )
                );
            });
    }

    onClose() {
        this.dialogRef.close();
    }

    onCameraCapture(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.uploadedFiles.push({
                    file,
                    name: file.name,
                    size: Math.round(file.size / 1024),
                    imagePreview: reader.result as string,
                    fromAPI: false,
                });
                // รวมภาพใหม่กับที่โหลดมาจาก API



            };

            reader.readAsDataURL(file);
        }
    }

    removeExistingImage(img: any): void {
        
        // กรอง allImages ใหม่ โดยไม่รวมภาพที่มาจาก data.images และตรงกับที่เลือก
        this.allImages = this.allImages.filter(existing => {
            // ถ้า image_url ตรงกันกับ img ที่จะลบ และเป็นของ data.images → ลบ
            if ((this.data?.images || []).some(d => d.image_url === existing.image_url)) {
                return existing.image_url !== img.image_url;
            }
            // ถ้าไม่ใช่ภาพจาก data.images → คงไว้
            return true;
        });
    }

    onSizeChange(event: any): void {
        const selectedSize = this.standard_size.find(
            (size) => size.No === event.value
        );
        if (selectedSize) {
            this.form.patchValue({
                weight: selectedSize.weight,
                width: selectedSize.width,
                height: selectedSize.height,
                long: selectedSize.long,
            });
        }
    }

    getUrl(path: string): string {
        if (!path) {
            return '';
        }
        return this.utilityService.getFullUrl(path);
    }

}
