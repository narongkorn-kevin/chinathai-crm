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
import { TaplogService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-branch-form',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
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
        MatDatepickerModule
    ]
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
    shifts: any[] = [
        { value: 'Lunch shift1', key: '12:00:00' },
        { value: 'Lunch shift2', key: '23:00:00' },
    ]
    constructor(
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private _service: TaplogService,
        private toastr: ToastrService,
    ) {
        console.log(' this.form', this.data);
        this.form = this.FormBuilder.group({
            sn: '',
            date: '',
            shift: '',
            datetime: ''
        });
    }

    ngOnInit(): void {
        if (this.data.type === 'EDIT') {
            this.form.patchValue({
                ...this.data.value
            })


        } else {
            console.log('New');
        }
    }

    Submit() {
        let formValue = this.form.value
        formValue.datetime = DateTime.fromISO(formValue.date).toFormat('yyyy-MM-dd') + ' ' + formValue.shift;
        
        
       
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
                        delete formValue.shift
                        delete formValue.date
                        this._service.create(formValue).subscribe({
                            error: (err) => {
                                this.toastr.error(err.error.message)
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
