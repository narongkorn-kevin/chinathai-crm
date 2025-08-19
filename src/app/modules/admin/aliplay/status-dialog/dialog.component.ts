import { Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject } from '@angular/core';
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
    FormControl,
    FormGroup,
    FormsModule,
    Validators,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { CreditService } from '../credit.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { AlipayService } from '../alipay.service';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { MatDivider } from '@angular/material/divider';
export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
}
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-member-form-view-2',
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
        MatDialogClose,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatDivider,
    ],
})
export class DialogStatus implements OnInit {
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;

    status: any[] = [
        { value: 'awaiting_payment', name: 'รอชำระ' },
        { value: 'in_progress', name: 'อยู่ระหว่างตรวจสอบ' },
        { value: 'completed', name: 'ชำระเงินสำเร็จ' },
        { value: 'cancelled', name: 'ยกเลิก/ล้มเหลว' },
    ];

    uploadedFiles: UploadedFile[] = [];

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogStatus>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: AlipayService,
        private fuseConfirmationService: FuseConfirmationService,
        private userService: AlipayService,
        private toastr: ToastrService
    ) {
        console.log(' this.form', this.data);
        this.form = this.FormBuilder.group({
            status: this.data.value?.status,
            id: this.data.value.id
        })
        // console.log('1111',this.data?.type);
    }

    ngOnInit(): void {
        if (this.data.type === 'EDIT') {
            //   this.form.patchValue({
            //     ...this.data.value,
            //     roleId: +this.data.value?.role?.id
            //   })
        } else {
            console.log('New');
        }
    }
    exportTemplate() {
        this.userService.export(this.form.value).subscribe({
            next: (resp: Blob) => {
                let fileName = `member.xlsx`;
                createFileFromBlob(resp, fileName);
            },
        });

        // const formData = new FormData();
        //     this.userService.export(formData).subscribe({
        //         next: (resp: Blob) => {
        //             let fileName = `original_.xlsx`;
        //             createFileFromBlob(resp, fileName);
        //           },
        //     })
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

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
           
                let formValue = this.form.value
                this.userService.updateStatus(formValue).subscribe({
                    error: (err) => {
                        this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                    },
                    complete: () => {
                        this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')
                        this.dialogRef.close(true)
                    },
                });
                this.dialogRef.close(true);
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
                    this.toastr.error(this.translocoService.translate('toastr.please_select_xlsx'));
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
}
