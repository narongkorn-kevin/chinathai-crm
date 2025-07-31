import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
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
    FormArray,
    FormControl,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { map, Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDivider } from '@angular/material/divider';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import {
    MatDatepickerModule,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InvoiceService } from '../invoice.service';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { serialize } from 'object-to-formdata';
export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
}
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-lot-dialog-save-payment',
    standalone: true,
    templateUrl: './dialog-save-payment.component.html',
    styleUrl: './dialog-save-payment.component.scss',
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
        MatSelectModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatRadioModule,
        MatCheckboxModule,
        MatDivider,
        MatDatepickerModule,
        MatAutocompleteModule,
        UploadFileComponent,
    ],
    animations: [
        trigger('slideToggleFilter', [
            state(
                'open',
                style({
                    height: '*',
                    opacity: 1,
                    overflow: 'hidden',
                })
            ),
            state(
                'closed',
                style({
                    height: '0px',
                    opacity: 0,
                    overflow: 'hidden',
                })
            ),
            transition('open <=> closed', [animate('300ms ease-in-out')]),
        ]),
    ],
})
export class DialogSavePaymentComponent implements OnInit {
    form: FormGroup;
    form_file: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    tracks = [];
    transports = [];

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogSavePaymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private http: HttpClient,
        private _service: InvoiceService
    ) {
        this.transports = this.data?.transports;
    }
    protected _onDestroy = new Subject<void>();

    ngOnInit(): void {
        console.log('data', this.data);
        const today = new Date().toISOString().split('T')[0];
        this.form = this.FormBuilder.group({
            payment_type: ['upload'],
            ref_no: [''],
            member_id: [''],
            total_price: [''],
            note: [''],
            image: [''],
            order_type: ['bill'],
            // ======================================
            type: [''],
            transport_type: [''],
            transport: [''],
            date: [today, Validators.required],
        });
        this.form.patchValue({
            ref_no: this.data?.code,
            member_id: this.data?.member_id,
            total_price: this.data?.total_amount ?? 0,
        });
        this.form_file = this.FormBuilder.group({
            file: [null],
            path: ['files/asset/', Validators.required],
        });
    }
    ngAfterViewInit() {}

    ngOnDestroy(): void {}

    Submit() {
        if (this.form.invalid) {
            this.toastr.error(this.translocoService.translate('toastr.missing_fields'));
            this.form.markAllAsTouched();
            return;
        }
        const formvalue = this.form.value;
        formvalue.date = new Date(formvalue?.date).toISOString().split('T')[0];

        console.log('formvalue', formvalue);
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
                this._service.paymentOrder(formvalue).subscribe({
                    next: (resp: any) => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.success')
                        );
                        this.dialogRef.close(true);
                    },
                    error: (err) => {
                        this.toastr.error(
                            this.translocoService.translate(err.error.message)
                        );
                    },
                });
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    onFilesChanged(files: UploadedFile[]): void {
        if (files && files.length > 0) {
            this.form_file.patchValue({
                file: files[0].file,
            });

            const formData = serialize({
                ...this.form_file.value,
            });

            this._service.upload_file(formData).subscribe({
                error: (err) => {
                    this.toastr.error(
                        this.translocoService.translate('toastr.unable_to_save')
                    );
                },
                next: (res: any) => {
                    this.form.patchValue({
                        image: res.path,
                    });
                },
            });
        } else {
            // Clear the image if no files
            this.form.patchValue({
                image: '',
            });
        }
    }
}
