import { data } from 'jquery';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { ProfileService} from './profile.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BranchComponent } from '../branch/page.component';
import { ActivatedRoute } from '@angular/router';
import { serialize } from 'object-to-formdata';
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
        FormsModule,
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
        BranchComponent
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ProfileComponent implements OnInit {
    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    store: any;
    storeId: number
    profile: any;
    constructor(
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public _service: ProfileService,

    ) {

        this.storeId = this.activatedRoute.snapshot.params.id;
        console.log(this.storeId)
        this.form = this.fb.group({
            fname: '',
            lname: '',
            phone: '',
            email: '',
            username: '',
            password: '',
        })
    }
    ngOnInit(): void {

        this.loadProfile();

    }

	loadProfile():void {
        // let id = localStorage.getItem('id');
        let id = 2;
		this._service.getProfile(id).subscribe((resp: any)=>{
			this.profile = resp.data;
            const [fname, ...lnameArr] = this.profile.name?.split(' ') ?? ['', ''];
            const lname = lnameArr.join(' ');
            this.form.patchValue({
                ...this.profile,
                fname,
                lname
              });
		})
	}

    Submit() {
        let formValue = this.form.value
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
                        name: `${this.form.value.fname ?? ''} ${this.form.value.lname ?? ''}`.trim(),
                        id: this?.profile?.id,
                    });
                    this._service.updateProfile(formData).subscribe({
                        error: (err) => {
                            this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                        },
                        complete: () => {
                            this.toastr.success('ดำเนินการแก้ไขข้อมูลสำเร็จ')
                        },
                    });
                }
            }
        )
    }
    clear(){
        this.form.reset();
    }

}
