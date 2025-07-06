import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { StoerService } from './page.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BranchComponent } from '../branch/page.component';
import { ActivatedRoute } from '@angular/router';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { ImageUploadService } from 'app/modules/common/image-upload/image-upload.service';

@Component({
    selector: 'app-page-store',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        BranchComponent,
        ImageUploadComponent
    ],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
})
export class StoreComponent implements OnInit {

    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    store: any;
    storeId: number

    constructor(
        private stoerService: StoerService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public activatedRoute: ActivatedRoute,
        private imageUploadService: ImageUploadService,
    ) {
        this.storeId = this.activatedRoute.snapshot.params.id;
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            code: '',
            name: '',
            address: '',
            logo: '',
            tax: '',
        })

        this.stoerService.getStoreId(this.storeId).subscribe((resp: any) => {
            this.store = resp

            this.form.patchValue({
                ...this.store
            })
        })
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
                    this.stoerService.update(this.store.id, this.form.value).subscribe({
                        error: (err) => {
                            this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                        },
                        complete: () => {
                            this.toastr.success('ดำเนินการแก้ไขข้อมูลสำเร็จ')
                            this.ngOnInit()
                        },
                    });
                }
            }
        )
    }

    uploadSuccess(event: any): void {
        this.imageUploadService.upload(event).subscribe({
            next: (resp: any) => {
                this.form.patchValue({
                    logo: resp.uuid
                });
            },
            error: (err) => {
                alert(JSON.stringify(err))
            },
        })
    }
}
