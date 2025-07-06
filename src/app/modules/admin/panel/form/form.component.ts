import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';

import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { PanelService } from '../page.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DialogForm } from '../form-dialog/dialog.component';
import { Router } from '@angular/router';
@Component({
    selector: 'app-page-panel',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSelectModule
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class PanelFormComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    form: FormGroup;
    itemsCount = 10;
    itemsArray = new Array(this.itemsCount).fill({});
    categories: any[] = [];
    productsByCategory: { [key: string]: any[] } = {};
    product: any;
    data: any
    constructor(
        private _service: PanelService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private router: Router,

    ) {
        this.form = this.fb.group({
            name: '',
            productIds: [],
            products: this.fb.array([])
        })

    }
    ngOnInit(): void {
        this.GetCategory();
        // for (let i = 0; i < 12; i++) {
        //     this.addRow();
        // }
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

    opendialogAdd(item: any) {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 500,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW',
                value: '',
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            console.log(result);

            if (result) {
               item.patchValue(
                {
                  product_id: result.id,
                  product_name: result.name,
                  category_name: result.category.name
                }
               )
            }
        });
    }

    ngAfterViewInit() {

    }

    ngOnDestroy(): void {

    }

    get products() {
        return this.form.get('products') as FormArray;
    }

    addRow() {
        const value = this.fb.group({
            product_id: '',
            category_id: '',
            product_name: '',
            category_name: '',
            // product_name: '',
        });

        this.products.push(value);
    }

    removeRow(index: number) {
        this.products.removeAt(index);
    }

    Submit() {
        let formValue = this.form.value
        formValue.productIds = this.form.value.products.map(product => product.product_id);
        console.log(formValue);

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
                    delete formValue.products
                    this._service.create(formValue).subscribe({
                        error: (err) => {
                            this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                        },
                        complete: () => {
                            this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')

                        },
                    });
                }
            }
        )
    }

    backTo() {
        this.router.navigateByUrl('/panel')
    }

}
