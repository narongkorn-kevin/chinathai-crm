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
import { PanelService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
@Component({
    selector: 'app-panel-form',
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
        MatRadioModule
    ]
})
export class DialogForm implements OnInit {

    form: FormGroup;
    branch: any;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    categories: any[] = [];
    productsByCategory: { [key: string]: any[] } = {};
    product: any;
    selectCategory: any
    selectItem: any;
    constructor(
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private _service: PanelService,
        private toastr: ToastrService,
    ) {

    }

    ngOnInit(): void {
        this.GetCategory()
        if (this.data.type === 'EDIT') {
            this.form.patchValue({
                ...this.data.value
            })


        } else {
            console.log('New');
        }
    }

    Submit() {
      this.dialogRef.close(this.selectItem)
    }

    onClose() {
        this.dialogRef.close()
    }

    GetCategory() {
        this._service.getCategory().subscribe((resp: any) => {
            this.categories = resp;

        });
    }

    ChangeCategory(data: any) {
        const categoryId = data.value;
        this._service.getProduct(categoryId).subscribe((resp: any) => {
            this.product = resp;

        });
    }
    selectProduct(data: any) {
        this.selectItem = data.value
    }

}
