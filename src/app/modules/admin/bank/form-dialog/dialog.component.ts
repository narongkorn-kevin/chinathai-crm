import { Component, OnInit, Inject, NgModule } from '@angular/core';
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
import { BankService } from '../bank.service';
import { serialize } from 'object-to-formdata';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { UploadFileComponent } from '../../../common/upload-file/upload-file.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
}

@Component({
    selector: 'app-device-form-2',
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
        TranslocoModule,
        ImageUploadComponent,
        UploadFileComponent,
    ],
})
export class DialogForm implements OnInit {
    form: FormGroup;
    form_file: FormGroup;
    form_qr_file: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    imageUrl: string;

    constructor(
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: BankService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private translocoService: TranslocoService
    ) {
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
        this.form_file = this.FormBuilder.group({
            file: [null],
            path: ['files/asset/', Validators.required],
        });
        this.form_qr_file = this.FormBuilder.group({
            file: [null],
            path: ['files/asset/', Validators.required],
        });
    }
    langues: any;
    lang: String;
    languageUrl: any;

    ngOnInit(): void {
        if (this.langues === 'en') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/en-gb.json';
        } else if (this.langues === 'th') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        } else if (this.langues === 'cn') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh.json';
        } else {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        }
        this.form = this.FormBuilder.group({
            id: '',
            bank_name: ['', Validators.required],
            branch: ['', Validators.required],
            account_name: ['', Validators.required],
            account_number: ['', Validators.required],
            vat: ['N'],
            image: [''],
            icon: [''],
        });

        if (this.data.type === 'EDIT') {
            const { vat, ...rest } = this.data.value ?? {};
            this.form.patchValue({
                ...rest,
                vat: this._normalizeVat(vat),
            });
        }
    }

    Submit() {
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }
        const formDatacon = {
            pleaseconfirm: {
                th: 'ยืนยันการบันทึกข้อมูล',
                en: 'Confirm data recording',
                cn: '确认保存数据',
            },
            confirm: { th: 'ยืนยัน', en: 'Confirm', cn: '确认' },
            cancel: { th: 'ยกเลิก', en: 'Cancel', cn: '取消' },
            pleasefill: {
                th: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                en: 'Please fill in all required fields',
                cn: '请填写完整信息',
            },
            errorsave: {
                th: 'ไม่สามารถบันทึกข้อมูลได้',
                en: 'Unable to save data',
                cn: '无法保存数据',
            },
            successadd: {
                th: 'ดำเนินการเพิ่มข้อมูลสำเร็จ',
                en: 'Successfully added data',
                cn: '成功添加数据',
            },
            successedit: {
                th: 'ดำเนินการแก้ไขข้อมูลสำเร็จ',
                en: 'Successfully edited data',
                cn: '成功编辑数据',
            },
        };
        if (this.form.invalid) {
            this.toastr.error(formDatacon.pleaseconfirm[this.langues]);
            return;
        }

        const confirmation = this.fuseConfirmationService.open({
            title: formDatacon.pleaseconfirm[this.langues],
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'primary',
            },
            actions: {
                confirm: {
                    show: true,
                    label: formDatacon.confirm[this.langues],
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: formDatacon.cancel[this.langues],
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const formData = this.form.value;
                if (this.data.type === 'NEW') {
                    this._service.create(formData).subscribe({
                        error: (err) => {
                            this.toastr.error(
                                formDatacon.errorsave[this.langues]
                            );
                        },
                        complete: () => {
                            this.toastr.success(
                                formDatacon.successadd[this.langues]
                            );
                            this.dialogRef.close(true);
                        },
                    });
                } else {
                    this._service.update(formData).subscribe({
                        error: (err) => {
                            this.toastr.error(
                                formDatacon.errorsave[this.langues]
                            );
                        },
                        complete: () => {
                            this.toastr.success(
                                formDatacon.successedit[this.langues]
                            );
                            this.dialogRef.close(true);
                        },
                    });
                }
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    uploadSuccess(file: File): void {
        this.form.patchValue({
            icon: file,
        });
    }

    onFilesChange(files: UploadedFile[], control: 'icon' | 'image' = 'icon'): void {
        const targetForm = control === 'icon' ? this.form_file : this.form_qr_file;

        if (files && files.length > 0) {
            targetForm.patchValue({
                file: files[0].file,
            });

            const formData = serialize({
                ...targetForm.value,
            });

            this._service.upload_file(formData).subscribe({
                error: () => {
                    this.toastr.error(
                        this.translocoService.translate('toastr.unable_to_save')
                    );
                },
                next: (res: any) => {
                    const patch: Record<string, any> = {};
                    patch[control] = res.path;
                    this.form.patchValue(patch);
                },
            });
        } else {
            // Clear the image if no files
            const patch: Record<string, any> = {};
            patch[control] = '';
            this.form.patchValue(patch);
        }
    }

    private _normalizeVat(value: any): 'Y' | 'N' {
        if (value === 'Y' || value === 'N') {
            return value;
        }

        if (typeof value === 'boolean') {
            return value ? 'Y' : 'N';
        }

        if (typeof value === 'number') {
            return value === 1 ? 'Y' : 'N';
        }

        if (typeof value === 'string') {
            const normalized = value.trim().toUpperCase();
            if (['Y', 'YES', 'TRUE', '1'].includes(normalized)) {
                return 'Y';
            }
            if (['N', 'NO', 'FALSE', '0'].includes(normalized)) {
                return 'N';
            }
        }

        return 'N';
    }
}
