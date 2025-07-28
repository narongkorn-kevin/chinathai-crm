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
import { OrderProductsService } from '../order-products.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute } from '@angular/router';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-order-product-form-dialog-2',
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
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    branches: any[] = [];
    selectedBranches: any[] = [];
    hidePassword = true;
    hideConfirmPassword = true;

    position = [];
    department = [];
    permission = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'พนักงาน' },
    ];

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: OrderProductsService,
        private fuseConfirmationService: FuseConfirmationService,
        private userService: OrderProductsService,
        private toastr: ToastrService,
        private activated: ActivatedRoute
    ) {
        this.department = this.data.department;
        this.position = this.data.position;
        console.log('data', this.data);

        if (this.data.type === 'EDIT') {
            this.form = this.FormBuilder.group({
                id: this.data.value.id ?? '',
                permission_id: this.data.value.permission_id ?? '',
                department_id: this.data.value.department_id ?? '',
                position_id: this.data.value.position_id ?? '',
                firstName: this.data.value.firstName ?? '',
                username: this.data.value.username ?? '',
                name: this.data.value.name ?? '',
                email: this.data.value.email ?? '',
                image: this.data.value.image ?? null,
                phone: this.data.value.phone ?? '',
                salary: this.data.value.salary ?? '',
                status: this.data.value.status ?? '',
            });
        } else {
            this.form = this.FormBuilder.group(
                {
                    permission_id: '',
                    department_id: '',
                    position_id: '',
                    firstName: '',
                    username: '',
                    name: '',
                    email: '',
                    password: [
                        '',
                        [Validators.required, Validators.minLength(6)],
                    ],
                    confirmPassword: [
                        '',
                        [Validators.required, Validators.minLength(6)],
                    ],
                    image: '',
                    phone: '',
                    salary: '',
                    status: '',
                },
                { validator: this.passwordMatchValidator }
            );
        }
    }

    ngOnInit(): void {
        if (this.data.type === 'EDIT') {
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
                    this.userService.create(formValue).subscribe({
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate('toastr.add_error')
                            );
                        },
                        complete: () => {
                            this.toastr.success(this.translocoService.translate('toastr.add'));
                            this.dialogRef.close(true);
                        },
                    });
                } else {
                    this.userService.update(formValue).subscribe({
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate('toastr.edit_error')
                            );
                        },
                        complete: () => {
                            this.toastr.success(
                                this.translocoService.translate('toastr.edit')
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
    selectionChanged(event: any) {
        // Map selected branches to their IDs
        this.selectedBranches = event.value;
        this.form.patchValue({
            branchIds: this.selectedBranches.map((branch) => branch.id),
        });
        console.log('Selected Branch IDs:', this.form.get('branchIds')?.value);
    }

    togglePasswordVisibility(field: string) {
        if (field === 'password') {
            this.hidePassword = !this.hidePassword;
        } else if (field === 'confirmPassword') {
            this.hideConfirmPassword = !this.hideConfirmPassword;
        }
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return password && confirmPassword && password === confirmPassword
            ? null
            : { mismatch: true };
    }
}
