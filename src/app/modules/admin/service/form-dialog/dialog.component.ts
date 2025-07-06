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
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { ServicesService } from '../services.service';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { ImageUploadService } from 'app/modules/common/image-upload/image-upload.service';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-device-form-18',
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
        MatRadioModule,
        // ImageUploadComponent,
    ]
})
export class DialogForm implements OnInit {

    form: FormGroup;
    imageUrl: string;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;

    image: File;
    images: File[] = [];

    constructor(
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public _service: ServicesService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private imageUploadService: ImageUploadService,
    ) {

    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            line: [''],
            phone: [''],
            image: [null],
            images: [[]],
            icons: this.fb.array([]),
            icon_boxs: this.fb.array([]),
        });

        if (this.data.type === 'EDIT') {
            this.form.patchValue({
                ...this.data.value,
                image: null
            })
            this.imageUrl = this.data.value.image

            this.icons.clear();
            this.data.value.icons.forEach((icon: any) => this.addIcon(icon));

            this.icon_boxs.clear();
            this.data.value.icon_boxs.forEach((iconBox: any) => this.addIconBox(iconBox));
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

        confirmation.afterClosed().subscribe(
            async result => {
                if (result == 'confirmed') {
                    //upload image
                    const imageResp = this.image
                        ? await this.uploadFile(this.image, 'images/asset/')
                        : null

                    //upload images
                    const imagesResp = []
                    for (const image of this.images) {
                        if (typeof image == 'string') {
                            imagesResp.push(image)
                            continue;
                        }

                        const imageResp = this.image
                            ? await this.uploadFile(image, 'images/asset/')
                            : null

                        imagesResp.push(imageResp)
                    }

                    //upload icon
                    const iconResp = [];
                    for (const icon of this.form.value.icons) {
                        if (typeof icon.image == 'string') {
                            iconResp.push({
                                name: icon.name,
                                image: icon.image,
                            })
                            continue;
                        }

                        const imageResp = this.image
                            ? await this.uploadFile(icon.image, 'images/asset/')
                            : null;

                        iconResp.push({
                            name: icon.name,
                            image: imageResp,
                        })
                    }

                    //upload icon box
                    const iconBoxResp = [];
                    for (const icon_box of this.form.value.icon_boxs) {
                        if (typeof icon_box.image == 'string') {
                            iconBoxResp.push({
                                name: icon_box.name,
                                description: icon_box.description,
                                image: icon_box.image,
                            })
                            continue;
                        }

                        const imageResp = this.image
                            ? await this.uploadFile(icon_box.image, 'images/asset/')
                            : null;

                        iconBoxResp.push({
                            name: icon_box.name,
                            description: icon_box.description,
                            image: imageResp,
                        })
                    }

                    const payload = {
                        ...this.form.value,
                        image: imageResp,
                        images: imagesResp,
                        icons: iconResp,
                        icon_boxs: iconBoxResp
                    }

                    if (this.data.type === 'NEW') {
                        this._service.create(payload).subscribe({
                            error: (err) => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')
                                this.dialogRef.close(true)
                            },
                        });
                    } else {
                        this._service.update(this.data.value.id, payload).subscribe({
                            error: (err) => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการแก้ไขข้อมูลสำเร็จ')
                                this.dialogRef.close(true)
                            },
                        });
                    }
                }
            }
        )
    }

    onClose() {
        this.dialogRef.close()
    }

    uploadSuccess(file: File): void {
        this.form.patchValue({
            image: file
        });
    }

    // Getter สำหรับ icons
    get icons(): FormArray {
        return this.form.get('icons') as FormArray;
    }

    // Getter สำหรับ icon_boxs
    get icon_boxs(): FormArray {
        return this.form.get('icon_boxs') as FormArray;
    }

    // ฟังก์ชันเพิ่ม icon
    addIcon(icon: any = null): void {
        this.icons.push(this.fb.group({
            id: [icon?.id || null], // ใช้สำหรับอัปเดต
            name: [icon?.name || ''],
            image: [icon?.image || ''],
            file: [null] // สำหรับอัปโหลดไฟล์ใหม่
        }));
    }

    // ฟังก์ชันลบ icon
    removeIcon(index: number): void {
        this.icons.removeAt(index);
    }

    // ฟังก์ชันเพิ่ม icon_box
    addIconBox(iconBox: any = null): void {
        this.icon_boxs.push(this.fb.group({
            id: [iconBox?.id || null], // ใช้สำหรับอัปเดต
            name: [iconBox?.name || ''],
            description: [iconBox?.description || ''],
            image: [iconBox?.image || ''],
            file: [null] // สำหรับอัปโหลดไฟล์ใหม่
        }));
    }

    // ฟังก์ชันลบ icon_box
    removeIconBox(index: number): void {
        this.icon_boxs.removeAt(index);
    }

    handleFileUpload(event: any) {
        this.image = event.target.files[0];
    }

    handleFilesUpload(event: any) {
        this.images = event.target.files;
    }

    async uploadFile(file: File, path: string): Promise<string> {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('path', path);

        try {
            const response: any = await lastValueFrom(this._service.upload(formData));
            return response.data; // สมมติ API ส่งคืน URL ของไฟล์ที่อัปโหลด
        } catch (error) {
            console.error('Upload error:', error);
            return '';
        }
    }

    handleFileIconUpload(event: any, control: any) {
        const file = event.target.files[0];
        if (file) {
            control.patchValue({ image: file });
        }
    }
}
