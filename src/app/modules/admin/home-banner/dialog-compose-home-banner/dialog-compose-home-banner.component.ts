import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    MatDialog,
    MatDialogContent,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { HomeBannerService } from '../home-banner.service';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';

@Component({
    selector: 'app-dialog-compose-home-banner',
    standalone: true,
    templateUrl: './dialog-compose-home-banner.component.html',
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogContent,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        UploadFileComponent
    ]
})
export class DialogComposeHomeBannerComponent implements OnInit {

    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    constructor(
        private readonly dialogRef: MatDialogRef<DialogComposeHomeBannerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { action: 'NEW' | 'EDIT' },
        public dialog: MatDialog,
        private readonly FormBuilder: FormBuilder,
        public readonly _service: HomeBannerService,
        private readonly fuseConfirmationService: FuseConfirmationService,
        private readonly toastr: ToastrService,
        private readonly userService: UserService,
        private readonly memberService: HomeBannerService,
        private readonly _router: Router
    ) {
        // console.log(this.data.member_id.id);

        // this.type = this.data.type
        // this.shipAddress = this.data.shipAddress;
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
        // this.form.patchValue({
        //     ...this.shipAddress,
        //     member_id: this.data.member_id.id
        // })
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

                if (this.data.action === 'NEW') {
                    this.memberService.createAddress(this.form.value).subscribe({
                        next: (resp: any) => {
                            this.toastr.success('บันทึกข้อมูลสำเร็จ');
                            this.dialogRef.close(true)
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
