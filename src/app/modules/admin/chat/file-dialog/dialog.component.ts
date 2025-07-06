import { Component, OnInit, Inject, NgModule } from '@angular/core';
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
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { serialize } from 'object-to-formdata';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { ChatService } from '../chat.service';

@Component({
    selector: 'app-file-dialog',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    imports: [CommonModule, DataTablesModule, MatIconModule, MatFormFieldModule, MatInputModule,
        FormsModule, MatToolbarModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        ImageUploadComponent,
    ]
})
export class FileDialogForm implements OnInit {

    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    imageUrl: string;
    type: string;
    constructor(
        private dialogRef: MatDialogRef<FileDialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: ChatService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
    ) {
        this.type = data.type;
    }

    ngOnInit(): void {
        this.form = this.FormBuilder.group({
            image:[''],
            file: [''],
            path: ['', Validators.required],
        });
    }

    Submit() {
        console.log('form',this.form.value);

        let path = '';
        if(this.type === 'image'){
            path = '/images/asset_chat_smg/';
        }else{
            path = '/files/';
        }
        this.form.patchValue({
            path: path
        });

        if (this.form.invalid) {
            return
        }

        console.log('form',this.form.value);

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

                    const formData = serialize({
                        ...this.form.value,
                    });
                    if (this.data.type === 'file') {
                        console.log('file');

                        this._service.upload_file(formData).subscribe({
                            error: (err) => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                            },
                            next: (res: any) => {
                                this.dialogRef.close(res)
                            },
                        });
                    } else {

                        this._service.upload_image(formData).subscribe({
                            error: (err) => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                            },
                            next: (res: any) => {
                                this.dialogRef.close(res)
                            },
                        });
                    }
                }
            }
        )
    }

    onClose() {
        this.dialogRef.close()
    }

    uploadSuccess(file: File): void {
        this.form.patchValue({
            image: file
        });
    }

    handleFilesUpload(event: any) {
        this.form.patchValue({
            file: event.target.files[0]
        });
    }
}
