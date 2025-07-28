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
    MatDialogClose,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { CreditService } from '../credit.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { MatDivider } from '@angular/material/divider';
import { LotService } from 'app/modules/admin/stock/lot/lot.service';
export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
}
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { UploadImageTwoService } from './upload-image-two.service';

@Component({
    selector: 'app-member-form-view-1',
    standalone: true,
    templateUrl: './upload-image-two.component.html',
    styleUrl: './upload-image-two.component.scss',
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
        MatDialogClose,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatDivider,
    ],
})
export class UploadImageTwoComponent implements OnInit {
    form: FormGroup;
    form_file: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    title: string;

    uploadedFiles: UploadedFile[] = [];

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<UploadImageTwoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: LotService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private service: UploadImageTwoService
    ) {
        this.title = data?.title ?? 'รูปภาพ';
        this.form = this.FormBuilder.group({
            packing_list_id: [this.data?.id],
            status: ['up'],
            images: this.FormBuilder.array([]), // FormArray สำหรับเก็บภาพ
            file: '',
            file_name: '',
            image_url: '',
        });

        this.form_file = this.FormBuilder.group({
            image: [null],
            path: ['images/asset/'],
        });
    }

    ngOnInit(): void { }

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

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this.uploadImage().then((resp: any) => {
                    this.dialogRef.close(resp);
                }).catch((err: any) => {
                    this.toastr.error(this.translocoService.translate(
                        'toastr.error'
                    ));
                });

            }

        });
    }

    onClose() {
        this.dialogRef.close();
    }

    fileError: string | null = null;
    files: File[] = [];
    onSelect(event, input: any) {
        if (input === 'addfile') {
            if (event && event.length > 0) {
                const file = event[0];
                const fileName = file.name;
                const fileExtension = fileName.split('.').pop()?.toLowerCase();
                if (fileExtension === 'xlsx') {
                    this.fileError = null;
                    this.form.patchValue({
                        file: event[0],
                        file_name: event[0].name,
                    });
                } else {
                    this.toastr.error(
                        this.translocoService.translate(
                            'toastr.please_select_xlsx'
                        )
                    );
                    // this.fileError = '';
                }
            }
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

    uploadImage(): Promise<any> {
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

}
