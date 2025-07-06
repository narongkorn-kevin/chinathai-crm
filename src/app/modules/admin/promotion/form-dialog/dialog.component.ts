import { Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject, ChangeDetectorRef } from '@angular/core';
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
import { PromotionService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';
import {MatRadioModule} from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
    selector: 'app-promotion-form',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
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
        MatInputModule,
        MatFormFieldModule,
        NgxMaskDirective,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]
})
export class DialogForm implements OnInit {

    form: FormGroup;
    stores: any[]=[];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;   
    displays: any[] = [
       {
        id: 'percent',
        name: 'เปอร์เซ็นต์'
       },
       {
        id: 'price',
        name: 'ราคา'
       },
    ];
    type: any[] = [
       {
        id: 'discount',
        name: 'ส่วนลด'
       },
       {
        id: 'gift',
        name: 'บัตรกำนัล'
       },
    ];
    
    constructor(
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: PromotionService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) 
    {
        console.log(' this.form', this.data);
        if(this.data.type === 'EDIT') {
            this.form = this.FormBuilder.group({
                code: this.data.value.code ?? '',
                name: this.data.value.name ?? '',
                detail: this.data.value.detail ?? '',
                amount: this.data.value.amount ?? '',
                display: this.data.value.display ?? '',
                type: this.data.value.type ?? '',
                startDate: this.data.value.startDate ?? '',
                endDate: this.data.value.endDate ?? '',
                isActive: this.data.value.isActive

             });
        } else {
            this.form = this.FormBuilder.group({
                code: '',
                name: '',
                detail: '',
                amount: ['', Validators.required],
                display: ['percent',Validators.required], // Assuming display control corresponds to 'ประเภทการลด'
                type: ['', Validators.required], // Assuming type control corresponds to 'รหัสประเภทโปรโมชั่น'
                startDate: '',
                endDate: '',
                isActive: true
             });
       
        }


        // console.log('1111',this.data?.type);
        
    }
    
    ngOnInit(): void {
         if (this.data.type === 'EDIT') {
        //   this.form.patchValue({
        //     ...this.data.value,
        //     roleId: +this.data.value?.role?.id
        //   })  
       
        } else {
   
        }
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
                    if (this.data.type === 'NEW') {
                        this._service.create(formValue).subscribe({
                            error: (err) => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                                // this.dialogRef.close(true)
                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')
                                this.dialogRef.close(true)
                            },
                        });
                    } else {
                        this._service.update(this.data.value.id ,formValue).subscribe({
                            error: (err) => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                                // this.dialogRef.close(true)
                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการแก้ไขข้อมูลสำเร็จ')
                                this.dialogRef.close(true)
                            },
                        });
                    }
                }
            }
        )
    }

    onClose() {
        this.dialogRef.close()
    }

    changeDate() {
        console.log(this.form.value);
        //     const formValue =  this.range.value
        //     this.range.value.start = moment(this.range.value.start).format('YYYY-MM-DD');
        //     this.range.value.end = moment(this.range.value.end).format('YYYY-MM-DD');
        //    console.log(this.range.value);
        this._changeDetectorRef.markForCheck()
    }
}
