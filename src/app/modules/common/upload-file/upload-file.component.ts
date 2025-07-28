import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
}

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asha-upload-file',
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: './upload-file.component.html',
    styleUrl: './upload-file.component.scss',
})
export class UploadFileComponent {
    @Input() multiple: boolean = false;
    @Input() existingImage: string | null = null;
    @Output() filesChanged = new EventEmitter<UploadedFile[]>(); // ส่งค่าออก

    uploadedFiles: UploadedFile[] = [];
    ngOnInit() {
        if (this.existingImage) {
            this.uploadedFiles = [
                {
                    file: null as any,
                    name: 'existing-image',
                    size: 0,
                    imagePreview: this.existingImage,
                },
            ];
        }
    }

    onFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            let filePromises = Array.from(input.files).map((file) => {
                return new Promise<UploadedFile>((resolve) => {
                    const reader = new FileReader();
                    const uploadedFile: UploadedFile = {
                        file,
                        name: file.name,
                        size: Math.round(file.size / 1024),
                        imagePreview: '',
                    };
                    reader.onload = () => {
                        uploadedFile.imagePreview = reader.result as string;
                        resolve(uploadedFile);
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(filePromises).then((newFiles) => {
                if (!this.multiple) {
                    this.uploadedFiles = newFiles.slice(0, 1);
                } else {
                    this.uploadedFiles = [...this.uploadedFiles, ...newFiles];
                }
                this.filesChanged.emit(this.uploadedFiles);
            });
        }

        // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์เดิมได้อีกครั้ง
        input.value = '';
    }

    removeFile(index: number): void {
        this.uploadedFiles.splice(index, 1);
        this.uploadedFiles = [...this.uploadedFiles]; // บังคับให้ Angular อัปเดต UI
        this.filesChanged.emit(this.uploadedFiles);
    }
}
