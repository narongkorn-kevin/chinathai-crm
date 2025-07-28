import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { UploadImageComponent } from '../upload-image/upload-image.component';

export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
}

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { UploadImageTwoComponent } from '../upload-image-two/upload-image-two.component';

@Component({
    selector: 'asha-dialog-view-image',
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ReactiveFormsModule,
    ],
    templateUrl: './dialog-view-image.component.html',
    styleUrl: './dialog-view-image.component.scss',
})
export class DialogViewImageComponent {
    @Input() multiple: boolean = false;
    @Output() filesChanged = new EventEmitter<UploadedFile[]>(); // ส่งค่าออก

    images: UploadedFile[] = [];
    previewOpen: boolean = false;
    previewImage: string = '';
    previewTitle: string = '';

    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    can_add: boolean = true;
    title: string = '';

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogViewImageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { images: any[]; can_add: boolean; title: string },
        public dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private toastr: ToastrService
    ) {

    }

    ngOnInit(): void {
         this.images = this.data.images;
         this.can_add = this.data.can_add;

         this.form = this._formBuilder.group({
            images: [],
        });
    }

    onClose() {
        this.dialogRef.close(this.images);
    }

    Submit() {
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }
        // จะดำเนินการเมื่อกดปุ่ม Submit
        this.dialogRef.close(this.images);
    }

    openUploadDialog(): void {
        const dialogRef = this.dialog.open(UploadImageTwoComponent, {
            width: '600px',
            maxHeight: '90vh',
            data: {
                multiple: this.multiple,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.dialogRef.close(result);
            }
        });
    }

    handlePreview(image: UploadedFile): void {
        this.previewImage = image.imagePreview;
        this.previewOpen = true;
        this.previewTitle = image.name;
    }

    handleClosePreview(): void {
        this.previewOpen = false;
    }

    handleDownload(image: UploadedFile): void {
        fetch(image.imagePreview)
            .then((response) => response.blob()) // ดึงข้อมูลรูปเป็น Blob
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = image.name || 'downloaded-image.jpg'; // ตั้งชื่อไฟล์
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url); // ล้าง URL ออกจากหน่วยความจำ
            })
            .catch((error) => console.error('Download error:', error));
    }

    handleDelete(index: number): void {
        // สร้าง dialog ยืนยันการลบ
        const confirmation = this._fuseConfirmationService.open({
            title: 'ลบรูปภาพ',
            message: 'คุณต้องการลบรูปภาพนี้ใช่หรือไม่?',
            actions: {
                confirm: {
                    label: this.translocoService.translate(
                        'confirmation.confirm_button'
                    ),
                },
                cancel: {
                    label: this.translocoService.translate(
                        'confirmation.cancel_button'
                    ),
                },
            },
        });

        // รับผลลัพธ์จาก dialog
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.images.splice(index, 1);
                this.filesChanged.emit(this.images);
                this.toastr.success(this.translocoService.translate('toastr.delete'));
            }
        });
    }
}
