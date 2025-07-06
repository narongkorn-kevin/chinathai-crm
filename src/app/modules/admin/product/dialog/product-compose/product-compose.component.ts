import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, Validators, FormArray } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { DemoFilePickerAdapter } from 'app/demo-file-picker.adapter';
import { NgxMaskDirective } from 'ngx-mask';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { ProductService } from '../../product.service';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { ImageUploadService } from 'app/modules/common/image-upload/image-upload.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-product-compose',
    standalone: true,
    templateUrl: './product-compose.component.html',
    styleUrl: './product-compose.component.scss',
    imports: [CommonModule, DataTablesModule, MatIconModule, MatFormFieldModule, MatInputModule,
        FormsModule, MatToolbarModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions,
        MatDialogClose, MatSelectModule, FilePickerModule, NgxMaskDirective, ReactiveFormsModule, MatTabsModule,
        MatDividerModule, ImageUploadComponent
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
    ]
})
export class ProductComposeComponent implements OnInit {

    selectedValue: string;
    form: FormGroup;
    catagories: any[] = [];
    units: any[] = [];
    title: string
    attForm: FormGroup;
    branch: any[] = [];

    item: any

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { type: string, value: any },
        private dialogRef: MatDialogRef<ProductComposeComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public productService: ProductService,
        private imageUploadService: ImageUploadService,
        private toastService: ToastrService
    ) { }

    ngOnInit(): void {

        this.form = this.fb.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            price: ['', Validators.required],
            image: [''],
            categoryId: ['', Validators.required],
            unitId: ['', Validators.required],
            branchId: ['', Validators.required],
        });

        this.attForm = this.fb.group({
            attributes: this.fb.array([])
        });

        if (this.data.type === 'NEW') {
            this.title = "เพิ่มสินค้า"

            //this.addAttribute()

        } else if (this.data.type === 'EDIT') {
            this.title = "แก้ไขสินค้า"

            this.item = this.data.value
            console.log(this.item);

            this.form = this.fb.group({
                ...this.data.value,
                categoryId: this.data?.value?.category?.id,
                unitId: this.data?.value?.unit?.id,
                branchId: this.data?.value?.branch?.id,

            });

            for (const productAttribute of this.data.value.productAttributes) {
                this.addAttribute(productAttribute)
            }
        }

        this.productService.categories$.subscribe(resp => this.catagories = resp);
        this.productService.units$.subscribe(resp => this.units = resp);
        this.productService.branch$.subscribe(resp => this.branch = resp);


    }

    attributes(): FormArray {
        return this.attForm.get('attributes') as FormArray
    }

    attributeValues(index: number): FormArray {
        return this.attributes().at(index).get('attributeValues') as FormArray
    }

    addAttribute(data?: any) {
        const g = this.fb.group({
            id: [null],
            name: ['', Validators.required],
            type: ['', Validators.required],
            attributeValues: this.fb.array([])
        })

        if (data) {
            g.patchValue({
                ...data,
            });

            for (const productAttributeValue of data?.productAttributeValues) {
                this.addAttValue(g, productAttributeValue)
            }
        }

        this.attributes().push(g)
    }

    addAttValue(fg: any, data?: any) {
        const g = this.fb.group({
            id: [null],
            name: ['', Validators.required],
            price: ['', Validators.required],
        })

        if (data) {
            g.patchValue({
                ...data
            })
        }

        const attributeValues = fg.get('attributeValues') as FormArray

        attributeValues.push(g)
    }

    removeAttribute(index: number) {
        this.attributes().removeAt(index)
    }

    removeAttValue(i: number, j: number) {
        this.attributeValues(i).removeAt(j)
    }

    Submit() {
        if (confirm('Are you sure you want to save')) {
            if (this.data.type === 'NEW') {
                this.create()
            } else {
                this.update()
            }
        }
    }

    create() {
        this.productService.create({
            code: this.form.value.code,
            name: this.form.value.name,
            price: this.form.value.price,
            image: this.form.value.image,
            categoryId: this.form.value.categoryId,
            unitId: this.form.value.unitId,
            branchId: this.form.value.branchId,
            attributes: this.attForm.value.attributes,
        }).subscribe({
            next: (resp: any) => {
                this.dialogRef.close(true)
            }
        })
    }

    update() {
        this.productService.update(this.data.value.id, {
            code: this.form.value.code,
            name: this.form.value.name,
            price: this.form.value.price,
            image: this.form.value.image,
            categoryId: this.form.value.categoryId,
            unitId: this.form.value.unitId,
            branchId: this.form.value.branchId,
            attributes: this.attForm.value.attributes,
        }).subscribe({
            next: (resp: any) => {
                this.dialogRef.close(true)
            }
        })
    }

    uploadSuccess(event): void {
        this.imageUploadService.upload(event).subscribe({
            next: (resp: any) => {
                this.form.patchValue({
                    image: resp.uuid
                });
            },
            error: (err) => {
                // alert(JSON.stringify(err))
                this.toastService.error('เกิดข้อผิดพลาด')
            },
        })
    }

    onSelectChange(event: any) {

    }
}
