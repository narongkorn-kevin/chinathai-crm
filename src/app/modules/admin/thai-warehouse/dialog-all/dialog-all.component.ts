import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
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
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    Validators,
    FormArray,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WarehouseService } from '../warehouse.service';
import { MatDivider } from '@angular/material/divider';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
@Component({
    selector: 'app-thai-warehouse-dialog-all',
    standalone: true,
    templateUrl: './dialog-all.component.html',
    styleUrl: './dialog-all.component.scss',
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
        MatCheckboxModule,
        MatDivider,
        MatDatepickerModule,
    ],
    animations: [
        trigger('slideToggleFilter', [
            state(
                'open',
                style({
                    height: '*',
                    opacity: 1,
                    overflow: 'hidden',
                })
            ),
            state(
                'closed',
                style({
                    height: '0px',
                    opacity: 0,
                    overflow: 'hidden',
                })
            ),
            transition('open <=> closed', [animate('300ms ease-in-out')]),
        ]),
    ],
})
export class DialogAllComponent implements OnInit {
    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    tracks = [];

    constructor(
        private dialogRef: MatDialogRef<DialogAllComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private http: HttpClient,
        private _service: WarehouseService,
    ) {
        this.form = this.FormBuilder.group({
            packing_list_id: [''],
        });
    }

    ngOnInit(): void {


    }
    ngAfterViewInit() {

    }

    ngOnDestroy(): void {

    }

    Submit() {
        const formValue = this.form.value;

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
                this.dialogRef.close(formValue);
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}
