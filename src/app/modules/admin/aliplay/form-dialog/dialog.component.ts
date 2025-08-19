import { map, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
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
import { AlipayService } from '../alipay.service';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { MatDivider } from '@angular/material/divider';
export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
}
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { OrderProductsService } from '../../order-products/order-products.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
    selector: 'app-alipaly-form-dialog',
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
        MatDivider,
        MatAutocompleteModule,
        NgxMatSelectSearchModule
    ],
})
export class DialogForm implements OnInit {
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

    memberFilter = new FormControl('');
    filterMember: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    members: any[] = [];

    customers: any[] = [
        { id: 1, name: 'นาย A' },
        { id: 2, name: 'นาย B' },
    ];
    types: any[] = [
        { id: 3, name: 'โอนเงินธนาคาร' },
        { id: 1, name: 'เติม alipay' },
        { id: 2, name: 'เติม Wechat pay' },
    ];

    uploadedFiles: UploadedFile[] = [];
    protected _onDestroy = new Subject<void>();

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: AlipayService,
        private fuseConfirmationService: FuseConfirmationService,
        private userService: AlipayService,
        private toastr: ToastrService,
        private service: OrderProductsService,
    ) {
        console.log(' this.form', this.data);
        this.form = this.FormBuilder.group({
            member_id: [null],
            transaction: [null],
            amount: [0],
            fee: [0],
            account_number: [null],
            account_name: [null],
            bank_name: [null],
            phone: [null],
            transfer_at: [null],
            image: [null],            // หลักฐานการโอนเงิน
            image_url: [null],
            image_slip: [null],       // หลักฐานการฝากชำระ
            image_slip_url: [null],
            total_price: [0],
        });

        

        this._service
            .getMember()
            .pipe(
                map((resp: { data: any[] }) => ({
                    ...resp,
                    data: resp.data.map((e) => ({
                        ...e,
                        fullname: `${e.code} ${e.fname} ${e.lname}`,
                    })),
                }))
            )
            .subscribe((member: { data: any[] }) => {
                this.members = member.data;

                this.filterMember.next(this.members);
            });

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

        this.form.get('amount')?.valueChanges.subscribe(() => {
            this.updateTotalPrice();
        });
        this.form.get('fee')?.valueChanges.subscribe(() => {
            this.updateTotalPrice();
        });

        this.memberFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterEmployee();
            });
    }


    protected _filterEmployee() {
        if (!this.members) {
            return;
        }

        const search = this.memberFilter.value;

        if (!search) {
            this.filterMember.next(this.members.slice());
            return;
        }

        // กรองข้อมูลโดยค้นหาใน firstname และ lastname
        this.filterMember.next(
            this.members.filter((item) => item.fullname.includes(search))
        );
    }

    updateTotalPrice(): void {
        const amount = parseFloat(this.form.get('amount')?.value) || 0;
        const fee = parseFloat(this.form.get('fee')?.value) || 0;
        const total = parseFloat((amount + fee).toFixed(4));
        this.form.get('total_price')?.setValue(total, { emitEvent: false });
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

        confirmation.afterClosed().subscribe(async (result) => {
            if (result === 'confirmed') {
                const formValue = this.form.value;
                // ตรวจสอบว่ามีการแนบไฟล์หรือไม่
                if (formValue.image) {
                    const slip: any = await this.uploadImage(); // อัปโหลดเฉพาะเมื่อมีไฟล์
                }

                this.dialogRef.close(true);

                if (this.data.type === 'NEW') {
                    this._service.create(formValue).subscribe({
                        error: (err) => {
                            this.toastr.error('ไม่สามารถบันทึกข้อมูลได้');
                        },
                        complete: () => {
                            this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ');
                            this.dialogRef.close(true);
                        },
                    });
                } else {
                    this._service.updatePayment(formValue).subscribe({
                        error: (err) => {
                            this.toastr.error('ไม่สามารถบันทึกข้อมูลได้');
                        },
                        complete: () => {
                            this.toastr.success('ดำเนินการแก้ไขข้อมูลสำเร็จ');
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

    onFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            Array.from(input.files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    this.uploadedFiles.push({
                        file,
                        name: file.name,
                        size: Math.round(file.size / 1024),
                        imagePreview: reader.result as string,
                    });
                };
                reader.readAsDataURL(file);
            });
        }
    }

    removeFile(index: number): void {
        this.uploadedFiles.splice(index, 1);
    }

    onSelectMember(event: any) {
        if (!event) {
            if (this.memberFilter.invalid) {
                this.memberFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No Approver Selected');
            return;
        }

        const selectedData = event; // event จะเป็นออบเจ็กต์ item

        if (selectedData) {
            this.form.patchValue({

                member_id: event.id,
                phone: event.phone,
            });
            this.memberFilter.setValue(selectedData.fullname);
        } else {
            if (this.memberFilter.invalid) {
                this.memberFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No Approver Found');
            return;
        }
    }

    uploadImage() {
        return new Promise((resolve, reject) => {
            const file = this.uploadedFiles[0]?.file;

            if (!file) {
                reject(new Error('No file selected'));
                return;
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('path', 'images/asset/');

            this.service.upload(formData).subscribe({
                next: (resp: any) => resolve(resp),
                error: (err: any) => reject(err),
            });
        });

    }
}
