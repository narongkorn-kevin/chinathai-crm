import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { FilePickerModule } from 'ngx-awesome-uploader';

@Component({
    selector: 'app-item-table',
    templateUrl: './item-table.component.html',
    styleUrl: './item-table.component.scss',
    standalone: true,
    imports: [
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
        MatRadioModule,
        MatDatepickerModule,
        MatCheckbox,
        MatDivider,
        MatIcon,
        ImageUploadComponent,
        RouterLink,
        MatTableModule,
        MatCheckboxModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
        CdkMenuModule,
        SelectMemberComponent,
        MatAutocompleteModule,
    ],
})
export class ItemTableComponent implements OnInit {
    form: FormGroup;
formFieldHelpers: string[] = ['fuse-mat-dense'];
    constructor(private fb: FormBuilder) { }
    ngOnInit(): void {
        this.form = this.fb.group({
            tracking: '',
            start_date: '',
            end_date: '',
            items: this.fb.array([]),
        });

        // mock ข้อมูล 3 แถว
        for (let i = 0; i < 3; i++) {
            this.addRow();
        }
    }

    get items(): FormArray {
        return this.form.get('items') as FormArray;
    }

    addRow() {
        const group = this.fb.group({
            pallet: [''],
            wm: [''],
            lot: [''],
            status: [''],
            carton: [''],
            receiveDate: [''],
            shipoutDate: [''],
            productCode: [''],
            orderNo: [''],
            customerPo: [''],
            barcode: [''],
            tracking: [''],
            qty: [''],
            weight: [''],
            length: [''],
            width: [''],
            height: [''],
            description: [''],
            brand: [''],
            category: [''],
            color: [''],
            price: [''],
            cbm: [''],
            expiry: [''],
            customer: [''],
            remark: [''],
            trackingNo: '',
            cartonNo: '',
            lotNo: '',
            transportMethod: '',
            trackingExt: '',
            chinaFreightCost: '',
            productName: '',
            impPre: '',
            profileRemark: '',
            customRemark: '',
            shipOutDate: '',
            lastUpdate: '',
            productDetail: '',
            warehouse: '',
            receiveStatus: '',
            woodenBoxCost: '',
            palletCost: '',
            otherCost: '',
            customerName: '',
            customerReferenceCode: '',
            customerCodeSystem: '',
            customerCodeOnBox: '',

        });

        this.items.push(group);
    }
}
