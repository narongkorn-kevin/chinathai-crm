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
import { MemberService } from '../member.service';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    MatDatepicker,
    MatDatepickerModule,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
@Component({
    selector: 'app-member-view-1',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
    imports: [
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
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatDivider,
    RouterLink
],
})
export class ViewComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    form: FormGroup;
    dtOptions: DataTables.Settings = {};
    type: string;
    Id: number;
    data: any;

    constructor(
        private FormBuilder: FormBuilder,
        public _service: MemberService,
        private fuseConfirmationService: FuseConfirmationService,
        private userService: MemberService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data.data.data;
    }

    ngOnInit(): void {

        this.form = this.FormBuilder.group({
            id: [''],
            code: [''],
            member_type: ['บุคคลทั่วไป', Validators.required],
            importer_code: ['', Validators.required],
            fname: ['', Validators.required],
            lname: ['', Validators.required],
            phone: ['', Validators.required],
            password: [''],
            confirmPassword: [''],
            birth_date: ['', Validators.required],
            gender: ['', Validators.required],
            address: ['', Validators.required],
            province: ['', Validators.required],
            district: ['', Validators.required],
            sub_district: ['', Validators.required],
            postal_code: ['', Validators.required],
            image: [null],
            transport_thai_master_id: 1,
            ever_imported_from_china: 'เคย', //เอาจากแบบสอบถามหน้าสมัคร
            order_quantity: '50', //เอาจากแบบสอบถามหน้าสมัคร
            frequent_importer: 'ไม่บ่อย', //เอาจากแบบสอบถามหน้าสมัคร
            need_transport_type: 'Express', //เอาจากแบบสอบถามหน้าสมัคร
            additional_requests: 'Deliver with extra care', //เอาจากแบบสอบถามหน้าสมัคร

            //============ นิติบุคคล ============

            comp_name: [''],
            comp_tax: [''],
            comp_phone: [''],

            //======== ตัวแทน ============
            cargo_name: [''],
            cargo_website: [''],
            cargo_image: [null],
            order_quantity_in_thai: '150',//เอาจากแบบสอบถามหน้าสมัคร

            province_code: [''],
            district_code: [''],
            sub_district_code: [''],
        });

        this.form.patchValue({
            id: this.data?.id,
            code: this.data?.code,
            member_type: this.data?.member_type,
            importer_code: this.data?.importer_code,
            fname: this.data?.fname,
            lname: this.data?.lname,
            phone: this.data?.phone,
            password: this.data?.password,
            birth_date: this.data?.birth_date,
            gender: this.data?.gender,
            address: this.data?.address,
            province: this.data?.province,
            district: this.data?.district,
            sub_district: this.data?.sub_district,
            postal_code: this.data?.postal_code,
            image: this.data?.image,
            transport_thai_master_id: this.data?.detail?.transport_thai_master_id,
            ever_imported_from_china: this.data?.detail?.ever_imported_from_china,
            order_quantity: this.data?.detail?.order_quantity,
            frequent_importer: this.data?.detail?.frequent_importer,
            need_transport_type: this.data?.detail?.need_transport_type,
            additional_requests: this.data?.detail?.additional_requests,
            comp_name: this.data?.detail?.comp_name,
            comp_tax: this.data?.detail?.comp_tax,
            comp_phone: this.data?.detail?.comp_phone,
            cargo_name: this.data?.detail?.cargo_name,
            cargo_website: this.data?.detail?.cargo_website,
            cargo_image: this.data?.detail?.cargo_image,
            order_quantity_in_thai: this.data?.detail?.order_quantity_in_thai,
        });
    }

    Close() {
        this._router.navigate(['member']);
    }
}
