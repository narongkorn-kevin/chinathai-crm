import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
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
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { ValidationError, FilePickerModule } from 'ngx-awesome-uploader';
import { DemoFilePickerAdapter } from 'app/demo-file-picker.adapter';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { ImageUploadService } from 'app/modules/common/image-upload/image-upload.service';
import { PoService } from '../../../po.service';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  templateUrl: './tracking-dialog.component.html',
  styleUrl: './tracking-dialog.component.scss',
  imports: [CommonModule, DataTablesModule, MatIconModule, MatFormFieldModule, MatInputModule,
    FormsModule, MatToolbarModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions,
    MatDialogClose, MatSelectModule, FilePickerModule, NgxMaskDirective, ReactiveFormsModule, MatSlideToggleModule,ImageUploadComponent
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class TrackingDialogComponent implements OnInit {
  form: FormGroup;
  adapter = new DemoFilePickerAdapter(this.http);
  BannerService: any;
  units: any;
  banner: any[] = []
item: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TrackingDialogComponent>,
    public dialog: MatDialog,
    private FormBuilder: FormBuilder,
    private fuseConfirmationService: FuseConfirmationService,
    private http: HttpClient,
    private _service: PoService,
    private toastr: ToastrService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    // console.log(' this.form', this.data);
    //  console.log(this.data.value.title)


}

ngOnInit(): void {
  if(this.data.type === 'EDIT') {
    this.form = this.FormBuilder.group({
      title: this.data.value.title ?? '',
      image: ['', Validators.required],
      description: [''],
      isShow: this.data.value.isShow ?? '',
     });
} else {
    this.form = this.FormBuilder.group({
        title: '',
        image: '',
        description: '',
        isShow: '',
     });
}

}


  // ngOnInit(): void {
  //   this.form = this.FormBuilder.group({
  //     title: ['', Validators.required],
  //     image: ['', Validators.required],
  //     description: [''],
  //     isShow: [true, Validators.required],
  //   });


  // }

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

  // Submit() {
  //   if (this.form.invalid) {
  //     return;
  //   }

  //   this.BannerService.create(this.form.value).subscribe({
  //     next: (resp: any) => {
  //       this.dialogRef.close(true)
  //     }
  //   })
  // }

  uploadSuccess(event): void {
    this.form.patchValue({
      image: event.uploadResponse.uuid
    });
  }

  onValidationError(error: ValidationError): void {
    if (error.file) {
        const mimeType = error.file.type; // ใช้ 'type' เพื่อรับ MIME type ของไฟล์

        if (!mimeType.startsWith('image/')) {
            alert(`Validation Error: The file ${error.file.name} is not an image.`);
        } else {
            alert(`Validation Error: ${error.error} in ${error.file.name}`);
        }
    } else {
        alert('Validation Error: No file provided.');
    }
}

  changeDate() {
    console.log(this.form.value);
    //     const formValue =  this.range.value
    //     this.range.value.start = moment(this.range.value.start).format('YYYY-MM-DD');
    //     this.range.value.end = moment(this.range.value.end).format('YYYY-MM-DD');
    //    console.log(this.range.value);
    this._changeDetectorRef.markForCheck()
}

    onClose() {
        this.dialogRef.close()
    }

}
