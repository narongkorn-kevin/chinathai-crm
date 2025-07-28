import { Component, OnInit, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    MatDialog,
    MatDialogContent,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { ArticleService } from '../article.service';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { Observable, of } from 'rxjs';
import { QuillEditorComponent } from 'ngx-quill';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { MatRadioModule } from '@angular/material/radio';

export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
}

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'dialog-compose-article-component',
    standalone: true,
    templateUrl: './dialog-compose-article.component.html',
    imports: [
        TranslocoModule,
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogContent,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        QuillEditorComponent,
        UploadFileComponent,
        MatRadioModule,
    ],
})
export class DialogComposeArticleComponent implements OnInit {
    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    category$: Observable<any>;
    type: string;
    value: any;

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogComposeArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: ArticleService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private userService: UserService,
        private memberService: ArticleService,
        private _router: Router
    ) {
        // console.log(this.data.member_id.id);

        this.type = this.data?.action;
        this.value = this.data?.value;

        this.form = this.FormBuilder.group({
            id: '',
            category_newss_id: '',
            name: '',
            description: '',
            image: '',
            image_url: '',
        });
    }

    ngOnInit(): void {
        // this.category$ = of(['ทั่วไป', 'กีฬา'])
        this._service.getCategoryNews().subscribe({
            next: (resp: any) => {
                this.category$ = of(resp.data);
            },
        });

        if (this.value) {
            this.form.patchValue({
                ...this.value,
                image: null,
                image_url: this.value.image,
            });
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    Submit() {
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }
        console.log(this.form.value);
        const formData = new FormData();
        Object.entries(this.form.value).forEach(([key, value]: any[]) => {
            formData.append(key, value);
        });
        console.log('formData', formData);

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
                if (this.data.action === 'NEW') {
                    this.memberService.create(formData).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate(
                                    'toastr.success'
                                )
                            );
                            this.dialogRef.close(true);
                        },
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate('toastr.error')
                            );
                        },
                    });
                } else {
                    this.memberService.update(formData).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate('toastr.edit')
                            );
                            this.dialogRef.close(true);
                        },
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate(
                                    'toastr.edit_error'
                                )
                            );
                        },
                    });
                }
            }
        });
    }
    onFilesChanged(files: UploadedFile[]): void {
        if (files && files.length > 0) {
            // Store the base64 string of the image in the form
            this.form.patchValue({
                image: files[0].file,
            });
        } else {
            // Clear the image if no files
            this.form.patchValue({
                image: '',
            });
        }
    }
}
