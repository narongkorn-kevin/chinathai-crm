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
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<AdvertComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { action: 'NEW' | 'EDIT' },
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: AdvertService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private userService: UserService,
        private memberService: AdvertService,
        private _router: Router
    ) {
        // console.log(this.data.member_id.id);

        // this.type = this.data.type
        // this.shipAddress = this.data.shipAddress;
        this.form = this.FormBuilder.group({
            id: '',
            member_id: '',
            address: '',
            province: '',
            district: '',
            sub_district: '',
            postal_code: '',
            latitude: '',
            longitude: '',
        });
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
                    this.memberService
                        .createAddress(this.form.value)
                        .subscribe({
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
                                    this.translocoService.translate(
                                        'toastr.error'
                                    )
                                );
                            },
                        });
                } else {
                    this.memberService
                        .updateAddress(this.form.value)
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
}
