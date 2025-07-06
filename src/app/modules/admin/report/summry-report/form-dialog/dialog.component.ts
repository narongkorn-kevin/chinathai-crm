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
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import {MatRadioModule} from '@angular/material/radio';
import { ReportService } from '../../page.service';
import { MatDateSelectionModel, MatDatepickerModule } from '@angular/material/datepicker';
@Component({
    selector: 'app-search-form',
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
    stores: any[]=[];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;   
    constructor(
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private _fb: FormBuilder,
        public _service: ReportService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
    ) 
    {
        console.log(' this.form', this.data);
        this.form = this._fb.group({
            startDate: '',
            endDate: '',
        })


        
    }
    
    ngOnInit(): void {

    }

    Submit() {
   
    }

    onClose() {
        this.dialogRef.close()
    }



}
