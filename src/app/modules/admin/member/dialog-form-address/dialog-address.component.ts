import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    MatDialog,
    MatDialogContent,
    MatDialogClose,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from '../member.service';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dialog-compose-vendor',
    standalone: true,
    templateUrl: './dialog-address.component.html',
    styleUrl: './dialog-address.component.scss',
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogContent,
        MatDialogClose,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
    ]
})
export class DialogAddressFormComponent implements OnInit {

    form: FormGroup;
    type: string = '';
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    shipAddress: any[] = [];

    constructor(
        private dialogRef: MatDialogRef<DialogAddressFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: MemberService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private userService: UserService,
        private memberService: MemberService,
        private _router: Router
    ) {
        console.log(this.data.member_id.id);
        this.type = this.data.type
        this.shipAddress = this.data.shipAddress;
        this.form = this.FormBuilder.group({
            id: '',
            member_id: '',
            address: '',
            province: '',
            district: '',
            sub_district: '',
            postal_code: '',
            latitude: '',
            longitude: '',
        })

    }

    ngOnInit(): void {
        this.form.patchValue({

            ...this.shipAddress,
            member_id: this.data.member_id.id
        })
    }

    onClose() {
        this.dialogRef.close();
    }
    Submit() {
        const confirmation = this.fuseConfirmationService.open({
            title: 'ยืนยันการบันทึกข้อมูล',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'primary',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {

                if (this.type === 'NEW') {
                    this.memberService.createAddress(this.form.value).subscribe({
                        next: (resp: any) => {
                            this.toastr.success('บันทึกข้อมูลสำเร็จ');
                            this.dialogRef.close()
                        },
                        error: (err) => {
                            this.toastr.error('บันทึกข้อมูลไม่สำเร็จ');
                        },
                    });
                } else {
                    this.memberService.updateAddress(this.form.value).subscribe({
                        next: (resp: any) => {
                            this.toastr.success('แก้ไขข้อมูลสำเร็จ');
                            this.dialogRef.close()
                        },
                        error: (err) => {
                            this.toastr.error('แก้ไขข้อมูลไม่สำเร็จ');
                        },
                    });
                }
            }
        });
    }

}
