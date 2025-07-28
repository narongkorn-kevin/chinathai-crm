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
import { DeliveryOrdersService } from '../delivery-orders.service';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-user-setting',
    standalone: true,
    templateUrl: './importexcel.component.html',
    styleUrl: './importexcel.component.scss',
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
export class ImportexcelComponent implements OnInit {
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    roles: any[] = [
        { id: 2, name: 'Admin' },
        { id: 5, name: 'Manager ' },
        { id: 3, name: 'Supervisor' },
        { id: 4, name: 'Cashier' },
    ];
    registerForm = new FormGroup({
        password: new FormControl('', [
            Validators.required,
            Validators.pattern(
                '^(?=.*[A-Z])(?=.*[0-9])(?=.*[-+_!@#$%^&*,.?])(?=.*[a-z]).{8,}$'
            ),
        ]),
    });

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<ImportexcelComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: DeliveryOrdersService,
        private fuseConfirmationService: FuseConfirmationService,
        private userService: DeliveryOrdersService,
        private toastr: ToastrService
    ) {
        console.log(' this.form', this.data);
        if (this.data.type === 'EDIT') {
            this.form = this.FormBuilder.group({
                file: '',
                file_name: '',
            });
        } else {
            this.form = this.FormBuilder.group({
                file: '',
                file_name: '',
            });
        }

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
                if (this.data.type === 'NEW') {
                    const formData = new FormData();
                    Object.entries(this.form.value).forEach(
                        ([key, value]: any[]) => {
                            if (
                                value !== '' &&
                                value !== 'null' &&
                                value !== null
                            ) {
                                formData.append(key, value);
                            }
                        }
                    );

                    this.userService.import(formData).subscribe({
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
                    // this.userService.update(this.data.value.id ,formValue).subscribe({
                    //     error: (err) => {
                    //         this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                    //     },
                    //     complete: () => {
                    //         this.toastr.success('ดำเนินการแก้ไขข้อมูลสำเร็จ')
                    //         this.dialogRef.close(true)
                    //     },
                    // });
                }
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
}
