import { activities } from './../../../../mock-api/pages/activities/data';
import { Component, OnInit, Inject } from '@angular/core';
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
}

@Component({
    selector: 'app-dialog-stock-in',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
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
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
    ],
})
export class DialogStockInComponent implements OnInit {
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    uploadForm: FormGroup;
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    fileSize: number = 0;
    uploadedFiles: UploadedFile[] = [];

    product_type = [];
    standard_size = [];
    unit = [];

    constructor(
        private dialogRef: MatDialogRef<DialogStockInComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private activated: ActivatedRoute,
        public _service: DeliveryOrdersService,
        private http: HttpClient,

    ) {
        this.product_type = this.data.product_type;
        this.standard_size = this.data.standard_size;
        this.unit = this.data.unit;
        // console.log(this.product_type, 'product_type');
        // console.log(this.standard_size, 'standard_size');
    }

    ngOnInit(): void {
        this.uploadForm = this.FormBuilder.group({});
        this.form = this.FormBuilder.group({
            product_type_id:  [null, Validators.required],
            product_name: ['', Validators.required],
            product_logo: [''],
            standard_size_id: [null, Validators.required],
            unit_id: [null, Validators.required],
            weight: '',
            width: '',
            height: '',
            long: '',
            qty: '',
            qty_box: '',
            image_url:'',
            images: this.FormBuilder.array([]),
        });

        if (this.data.type === 'EDIT') {
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
        if (this.form.invalid) {
            return;
        }

        const uploadObservables = this.uploadedFiles.map(file => {
            const formData = new FormData();
            formData.append('image', file.file);
            formData.append('path', 'images/asset/');
            return this.http.post<{ data: string }>('/api/upload_images', formData).toPromise();
        });
        console.log(uploadObservables, 'uploadObservables');


        Promise.all(uploadObservables).then(responses => {
            const images = responses.map(response => ({
                image: response.data,
                image_url: response.data
            }));

            const formValue = {
                ...this.form.value,
                images: images.length > 0 ? images : [{ image: "" }]
            };

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
                    this._service.createpo(formValue).subscribe({
                        error: (err) => {
                            this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                        },
                        next: (res:any) => {
                            this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')
                            this.dialogRef.close(res.data)
                        }
                    });
                }
            });
        }).catch(() => {
            this.toastr.error('ไม่สามารถอัปโหลดรูปภาพได้');
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
                });
            };
            reader.readAsDataURL(file);
        }
    }
    onSizeChange(event: any): void {
        console.log(event, 'event');

        const selectedSize = this.standard_size.find(size => size.No === event.value);
        console.log(selectedSize, 'selectedSize');

        if (selectedSize) {
            this.form.patchValue({
                weight: selectedSize.weight,
                width: selectedSize.width,
                height: selectedSize.height,
                long: selectedSize.long
            });
        }
    }
}
