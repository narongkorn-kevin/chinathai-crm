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
import { DialogAddress } from './dialog-address';

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
export class DialogAddressComponent implements OnInit {

    form: FormGroup;

    formFieldHelpers: string[] = ['fuse-mat-dense'];

    shipAddress: DialogAddress[] = [];

    constructor(
        private dialogRef: MatDialogRef<DialogAddressComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: MemberService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
    ) {

        this.shipAddress = this.data.shipAddress;
    }

    ngOnInit(): void {

    }

    selectAddress(address: DialogAddress) {
        this.dialogRef.close(address);
    }
}
