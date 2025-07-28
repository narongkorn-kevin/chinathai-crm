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
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ArticleService } from '../../article.service';
import { UserService } from 'app/core/user/user.service';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'dialog-compose-article-category-component',
    standalone: true,
    templateUrl: './dialog-compose-article-category.component.html',
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
    ],
})
export class DialogComposeArticleCategoryComponent implements OnInit {
    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    category$: Observable<any>;
    type: string;
    value: any;

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogComposeArticleCategoryComponent>,
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
            name: '',
        });
    }

    ngOnInit(): void {
        this.form.patchValue({
            ...this.value,
        });
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
                    this.memberService.createtype(this.form.value).subscribe({
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
                    this.memberService.updatetype(this.form.value).subscribe({
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
}
