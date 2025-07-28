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
import { CategoryNewsService } from '../category-news.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-category-news-dialog',
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
export class DialogForm implements OnInit {
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    constructor(
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: CategoryNewsService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private translocoService: TranslocoService
    ) {
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;
    languageUrl: any;

    ngOnInit(): void {
        this.form = this.FormBuilder.group({
            name: ['', Validators.required],
        });

        if (this.data.type === 'EDIT') {
            this.form.patchValue({
                ...this.data.value,
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
        const Datacon = {
            pleaseconfirm: { th: 'ยืนยันการบันทึกข้อมูล', en: 'Confirm data recording', cn: '确认保存数据' },
            confirm: { th: 'ยืนยัน', en: 'Confirm', cn: '确认' },
            cancel: { th: 'ยกเลิก', en: 'Cancel', cn: '取消' },
            pleasefill: { th: 'กรุณากรอกข้อมูลให้ครบถ้วน', en: 'Please fill in all required fields', cn: '请填写完整信息' },
            errorsave: { th: 'ไม่สามารถบันทึกข้อมูลได้', en: 'Unable to save data', cn: '无法保存数据' },
            successadd: { th: 'ดำเนินการเพิ่มข้อมูลสำเร็จ', en: 'Successfully added data', cn: '成功添加数据' },
            successedit: { th: 'ดำเนินการแก้ไขข้อมูลสำเร็จ', en: 'Successfully edited data', cn: '成功编辑数据' },
        };
        if (this.form.invalid) {
            return;
        }

        const formValue = {
            ...this.form.value,
        };

        const confirmation = this.fuseConfirmationService.open({
            title: Datacon.pleaseconfirm[this.langues],
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'primary',
            },
            actions: {
                confirm: {
                    show: true,
                    label: Datacon.confirm[this.langues],
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: Datacon.cancel[this.langues],
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                if (this.data.type === 'NEW') {
                    this._service.create(formValue).subscribe({
                        error: (err) => {
                            this.toastr.error(Datacon.errorsave[this.langues]);
                        },
                        complete: () => {
                            this.toastr.success(Datacon.successadd[this.langues]);
                            this.dialogRef.close(true);
                        },
                    });
                } else {
                    this._service
                        .update(this.data.value.id, formValue)
                        .subscribe({
                            error: (err) => {
                                this.toastr.error(Datacon.errorsave[this.langues]);
                            },
                            complete: () => {
                                this.toastr.success(
                                    Datacon.successedit[this.langues]
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
}
