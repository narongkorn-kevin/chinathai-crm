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
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { CreditService } from '../credit.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { AliplayService } from '../aliplay.service';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { MatDivider } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    imagePreview: string;
}
@Component({
    selector: 'app-member-form-view-3',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
    imports: [CommonModule, DataTablesModule, MatIconModule, MatFormFieldModule, MatInputModule,
        FormsModule, MatToolbarModule,
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
        MatDatepickerModule
    ]
})

export class ViewComponent implements OnInit {

    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    type: string;


    uploadedFiles: UploadedFile[] = [];


    constructor(
        private dialogRef: MatDialogRef<ViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: AliplayService,
        private fuseConfirmationService: FuseConfirmationService,
        private userService: AliplayService,
        private toastr: ToastrService,

    ) {
        console.log(' this.form', this.data);
        this.form = this.FormBuilder.group({
            alipay: [0],
            fee: [0],
            total: [0],
            note: [''],
        });
        this.type = this.data?.type;

        // console.log('1111',this.data?.type);

    }

    ngOnInit(): void {
        if (this.data.type === 'QR') {
            console.log('QR');
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
        })

        // const formData = new FormData();
        //     this.userService.export(formData).subscribe({
        //         next: (resp: Blob) => {
        //             let fileName = `original_.xlsx`;
        //             createFileFromBlob(resp, fileName);
        //           },
        //     })

    }


    Submit() {

        const confirmation = this.fuseConfirmationService.open({
            title: "ยืนยันการบันทึกข้อมูล",
            icon: {
                show: true,
                name: "heroicons_outline:exclamation-triangle",
                color: "primary"
            },
            actions: {
                confirm: {
                    show: true,
                    label: "ยืนยัน",
                    color: "primary"
                },
                cancel: {
                    show: true,
                    label: "ยกเลิก"
                }
            },
            dismissible: false
        })

        confirmation.afterClosed().subscribe(
            result => {
                if (result == 'confirmed') {

                    // const formData = new FormData();
                    // Object.entries(this.form.value).forEach(
                    //     ([key, value]: any[]) => {
                    //         if (value !== '' && value !== 'null' && value !== null) {
                    //             formData.append(key, value);
                    //             }
                    //     }
                    // );

                    // this.userService.import(formData).subscribe({
                    //     error: (err) => {
                    //         this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                    //     },
                    //     complete: () => {
                    //         this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')
                    //         this.dialogRef.close(true)
                    //     },
                    // });
                    this.dialogRef.close(true)
                }
            }
        )
    }

    onClose() {
        this.dialogRef.close()
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
                    this.toastr.error('กรุณาเลือกไฟล์นามสกุล .xlsx เท่านั้น')
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
}
