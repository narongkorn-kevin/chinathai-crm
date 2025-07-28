import { Component, OnInit, Inject } from '@angular/core';
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
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { AdvertService } from '../advert.service';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { serialize } from 'object-to-formdata';
export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
}
@Component({
    selector: 'app-dialog-compose-advert',
    standalone: true,
    templateUrl: './dialog-compose-advert.component.html',
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
        UploadFileComponent,
    ],
})
export class AdvertComponent implements OnInit {
    form: FormGroup;
    form_file: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    constructor(
        private translocoService: TranslocoService,
        private readonly dialogRef: MatDialogRef<AdvertComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private readonly FormBuilder: FormBuilder,
        public readonly _service: AdvertService,
        private readonly fuseConfirmationService: FuseConfirmationService,
        private readonly toastr: ToastrService,
        private readonly userService: UserService,
        private readonly memberService: AdvertService,
        private readonly _router: Router
    ) {
        // console.log(this.data.member_id.id);

        // this.type = this.data.type
        // this.shipAddress = this.data.shipAddress;
        this.form = this.FormBuilder.group({
            id: [''],
            url: ['', Validators.required],
            icon: [''],
            seq: [''],
        });
        this.form_file = this.FormBuilder.group({
            image: [null],
            path: ['images/asset/'],
        });
        if (this.data.action === 'EDIT') {
            this.form.patchValue({
                ...this.data.data,
            });
        } else {
            this.form.patchValue({
                seq: this.data.seq,
            });
        }
    }

    ngOnInit(): void {
        // this.form.patchValue({
        //     ...this.shipAddress,
        //     member_id: this.data.member_id.id
        // })
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
                    this.memberService.create(this.form.value).subscribe({
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
                    this.memberService
                        .update(this.form.value, this.form.value.id)
                        .subscribe({
                            next: (resp: any) => {
                                this.toastr.success(
                                    this.translocoService.translate(
                                        'toastr.edit'
                                    )
                                );
                                this.dialogRef.close();
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
            this.form_file.patchValue({
                image: files[0].file,
            });

            const formData = serialize({
                ...this.form_file.value,
            });

            this._service.upload_image(formData).subscribe({
                error: (err) => {
                    this.toastr.error(
                        this.translocoService.translate('toastr.unable_to_save')
                    );
                },
                next: (res: any) => {
                    this.form.patchValue({
                        icon: res.data,
                    });
                },
            });
        } else {
            // Clear the image if no files
            this.form.patchValue({
                icon: '',
            });
        }
    }
}
