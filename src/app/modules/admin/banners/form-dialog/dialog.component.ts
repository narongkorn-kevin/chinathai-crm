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
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { Observable } from 'rxjs';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { ImageUploadService } from 'app/modules/common/image-upload/image-upload.service';
import { UploadImageService } from 'app/modules/common/upload-image/upload-image.service';
import { serialize } from 'object-to-formdata';
import { BannersService } from '../banners.service';
@Component({
    selector: 'app-device-form-9',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    imports: [CommonModule, DataTablesModule, MatIconModule, MatFormFieldModule, MatInputModule,
        FormsModule, MatToolbarModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        ImageUploadComponent
    ]
})
export class DialogForm implements OnInit {

    form: FormGroup;
    imageUrl: string;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;

    category_news: Observable<any>;

    constructor(
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: BannersService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private imageUploadService: ImageUploadService,
        private uploadImageService: UploadImageService,
    ) {

    }

    ngOnInit(): void {

        this.form = this.FormBuilder.group({
            id: [''],
            type: ['', ],
            seq: ['', ],
            image: [null]
        });

        if (this.data.type === 'EDIT') {
            this.form.patchValue({
                ...this.data.value,
                image: null
            })

            this.imageUrl = this.data.value.image
        }
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

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const formValue = { ...this.form.value } as any;

                const proceed = (payload: any) => {
                    if (this.data.type === 'NEW') {
                        this._service.create(payload).subscribe({
                            error: () => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')
                                this.dialogRef.close(true)
                            },
                        });
                    } else {
                        this._service.update(payload).subscribe({
                            error: () => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการแก้ไขข้อมูลสำเร็จ')
                                this.dialogRef.close(true)
                            },
                        });
                    }
                };

                const file: File = this.form.get('image')?.value;

                if (this.isNewImage && file instanceof File) {
                    const fd = new FormData();
                    fd.append('image', file);
                    fd.append('path', 'images/asset/');
                    this.uploadImageService.upload(fd).subscribe({
                        next: (resp: any) => {
                            // backend variations: {path}, {data}, {uuid}, {url}, {image}
                            const imagePath = resp?.path ?? resp?.data ?? resp?.uuid ?? resp?.url ?? resp?.image;
                            proceed({ ...formValue, image: imagePath });
                        },
                        error: () => {
                            this.toastr.error('อัปโหลดรูปภาพไม่สำเร็จ');
                        },
                    });
                } else {
                    // Keep existing image on edit if no new image was uploaded
                    const payload =
                        this.data.type === 'EDIT' && this.imageUrl
                            ? { ...formValue, image: this.imageUrl }
                            : formValue;
                    proceed(payload);
                }
            }
        })
    }

    onClose() {
        this.dialogRef.close()
    }

    isNewImage = false;

    uploadSuccess(file: File): void {
        this.form.patchValue({
            image: file
        });
        this.isNewImage = true;        // มีการอัปโหลดรูปใหม่
        this.imageUrl = null;
        // this.imageUploadService.upload(event).subscribe({
        //     next: (resp: any) => {
        //         this.form.patchValue({
        //             logo: resp.uuid
        //         });
        //     },
        //     error: (err) => {
        //         alert(JSON.stringify(err))
        //     },
        // })
    }


}
