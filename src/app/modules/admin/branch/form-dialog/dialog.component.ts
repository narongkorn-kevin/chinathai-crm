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
import { BranchService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-branch-form',
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
    ],
})
export class DialogForm implements OnInit {
    form: FormGroup;
    branch: any;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    roles: any[] = [
        { id: 2, name: 'Admin' },
        { id: 3, name: 'Supervisor' },
        { id: 4, name: 'Cashier' },
    ];
    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private _service: BranchService,
        private toastr: ToastrService
    ) {
        console.log(' this.form', this.data);
        this.form = this.FormBuilder.group({
            code: '',
            name: '',
            address: '',
            storeId: +this.data.store,
        });
    }

    ngOnInit(): void {
        if (this.data.type === 'EDIT') {
            this.form.patchValue({
                ...this.data.value,
            });
        } else {
            console.log('New');
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
        let formValue = this.form.value;
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
                if (this.data.type === 'NEW') {
                    this._service.create(formValue).subscribe({
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate(
                                    'toastr.unable_to_save'
                                )
                            );
                        },
                        complete: () => {
                            this.toastr.success(
                                this.translocoService.translate(
                                    'toastr.data_addition_successful'
                                )
                            );
                            this.dialogRef.close(true);
                        },
                    });
                } else {
                    this._service
                        .update(this.data.value.id, formValue)
                        .subscribe({
                            error: (err) => {
                                this.toastr.error(
                                    this.translocoService.translate(
                                        'toastr.unable_to_save'
                                    )
                                );
                            },
                            complete: () => {
                                this.toastr.success(
                                    this.translocoService.translate(
                                        'toastr.data_correction_successful'
                                    )
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
