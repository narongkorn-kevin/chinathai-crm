import { Component, OnInit, Inject } from '@angular/core';
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
import { ProblemTopicService } from '../problem-topic.service';

@Component({
    selector: 'app-device-form-13',
    standalone: true,
    templateUrl: './dialog-view.component.html',
    styleUrl: './dialog-view.component.scss',
    imports: [CommonModule, DataTablesModule, MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatRadioModule
    ]
})
export class DialogViewComponent implements OnInit {

    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    constructor(
        private dialogRef: MatDialogRef<DialogViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: ProblemTopicService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
    ) {
        this.form = this.FormBuilder.group({
            code: [''],
            fname: [''],
            lname: [''],

            topic: [''],
            master: [''],
            name: [''],
            description: [''],
            Image: [['']],
        });

        this.form.patchValue({
            code: this.data.value?.member?.code,
            fname: this.data.value?.member?.fname,
            lname: this.data.value?.member?.lname,
            topic: this.data.value?.topic?.name,
            master: this.data.value?.master?.name,
            name: this.data.value?.name,
            description: this.data.value?.description,
            Image: this.data.value?.images,
        });
    }

    ngOnInit(): void {
        console.log('data',this.form.value);

    }

    Submit() {
        if (this.form.invalid) {
            return
        }

        const formValue = {
            ...this.form.value
        }

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
                    if (this.data.type === 'NEW') {
                        this._service.create(formValue).subscribe({
                            error: (err) => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')
                                this.dialogRef.close(true)
                            },
                        });
                    } else {
                        this._service.update(this.data.value.id, formValue).subscribe({
                            error: (err) => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการแก้ไขข้อมูลสำเร็จ')
                                this.dialogRef.close(true)
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

}
