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
import { NgxMaskDirective } from 'ngx-mask';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CouponService } from '../../coupon.service';

@Component({
  selector: 'app-coupon-compose',
  standalone: true,
  templateUrl: './coupon-compose.component.html',
  styleUrl: './coupon-compose.component.scss',
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
    FilePickerModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  ],
})
export class CouponComposeComponent implements OnInit {
  form: FormGroup;
  adapter = new DemoFilePickerAdapter(this.http);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CouponComposeComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private fuseConfirmationService: FuseConfirmationService,
    private http: HttpClient,
    private _service: CouponService,
    private toastr: ToastrService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.data?.type === 'EDIT') {
      const v = this.data.value;
      this.form = this.fb.group({
        name: [v?.name ?? '', Validators.required],
        description: [v?.description ?? ''],
        amount: [v?.amount ?? null, [Validators.required]],
        qty: [v?.qty ?? null],
        expire_date: [v?.expire_date ? new Date(v.expire_date) : null],
        type_amount: [v?.type_amount ?? ''],
        type: [v?.type ?? '', Validators.required],
        image: [v?.image ?? ''],
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        amount: [null, [Validators.required]],
        qty: [null],
        expire_date: [null],
        type_amount: ['฿'],
        type: ['free_point', Validators.required],
        image: [''],
      });
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  Submit(): void {
    if (this.form.invalid) return;

    const confirmation = this.fuseConfirmationService.open({
      title: 'ยืนยันบันทึกข้อมูล',
      message: 'กรุณาตรวจสอบข้อมูลให้ถูกต้อง',
      icon: { show: true, name: 'heroicons_outline:exclamation-triangle', color: 'primary' },
      actions: {
        confirm: { show: true, label: 'ยืนยัน', color: 'primary' },
        cancel: { show: true, label: 'ยกเลิก' },
      },
      dismissible: false,
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        const formValue = { ...this.form.value };
        // Ensure date is formatted as YYYY-MM-DD if present
        if (formValue.expire_date instanceof Date) {
          const y = formValue.expire_date.getFullYear();
          const m = (formValue.expire_date.getMonth() + 1).toString().padStart(2, '0');
          const d = formValue.expire_date.getDate().toString().padStart(2, '0');
          formValue.expire_date = `${y}-${m}-${d}`;
        }

        if (this.data?.type === 'NEW') {
          this._service.create(formValue).subscribe({
            error: () => {
              this.toastr.error('ไม่สามารถบันทึกข้อมูลได้');
            },
            complete: () => {
              this.toastr.success('บันทึกข้อมูลสำเร็จ');
              this.dialogRef.close(true);
            },
          });
        } else {
          const id = this.data?.value?.id;
          this._service.update(id, formValue).subscribe({
            error: () => {
              this.toastr.error('ไม่สามารถบันทึกข้อมูลได้');
            },
            complete: () => {
              this.toastr.success('แก้ไขข้อมูลสำเร็จ');
              this.dialogRef.close(true);
            },
          });
        }
      }
    });
  }

  uploadSuccess(event: any): void {
    // Follow banners: set image to returned uuid
    this.form.patchValue({ image: event.uploadResponse?.uuid ?? event.uploadResponse });
    this._cdr.markForCheck();
  }

  onValidationError(error: ValidationError): void {
    if (error.file) {
      const mimeType = error.file.type;
      if (!mimeType.startsWith('image/')) {
        alert(`Validation Error: The file ${error.file.name} is not an image.`);
      } else {
        alert(`Validation Error: ${error.error} in ${error.file.name}`);
      }
    } else {
      alert('Validation Error: No file provided.');
    }
  }
}

