import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WarehouseService } from './warehouse.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateTime } from 'luxon';
import { ScanBarcodeComponent } from 'app/modules/shared/scan-barcode.component';

@Component({
  selector: 'app-barcode-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    ScanBarcodeComponent,
    TranslocoModule,
  ],
  templateUrl: './barcode-dialog.component.html',
})
export class BarcodeDialogComponent implements OnInit {
  form: FormGroup;
  formThai: FormGroup;
  packing_list = [];

  barcodeList: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<BarcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: WarehouseService,
    private FormBuilder: FormBuilder,
    private toastr: ToastrService,
    private translocoService: TranslocoService,
  ) {
    this.form = this.FormBuilder.group({
      packing_list_id: this.data.id,
    });
    this.formThai = this.FormBuilder.group({
      date: [null, Validators.required],
      packing_list_id: [null, Validators.required],
      order_lists: this.FormBuilder.array([])
    });
  }

  ngOnInit(): void {
    this._service.getPackingListNotThai().subscribe((res: any) => {
      this.packing_list = res.data;
    });
  }

  simulateScan() {

    const today = DateTime.local().toFormat('yyyy-MM-dd');

    this.formThai.patchValue({
      date: today,
      packing_list_id: this.data.id,
    })

    this.barcodeList.forEach((item) => {
      this.orderLists.push(this.FormBuilder.group({
        delivery_order_id: item.delivery_order_id,
        delivery_order_list_id: item.delivery_order_list_id,
        delivery_order_list_item_id: item.id,
        // images: this.FormBuilder.array([])
      }));
    });

    this._service.addItemToThaiStore(this.formThai.value).subscribe({
      next: (resp: any) => {
        this.toastr.success(this.translocoService.translate('toastr.success'));

        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastr.error(this.translocoService.translate('toastr.error'));
      },
    });
  }

  get orderLists(): FormArray {
    return this.formThai.get('order_lists') as FormArray;
  }

  cancel() {
    this.dialogRef.close();
  }

  checkItem(data: any) {
    const itemId = this.data.packling_list_order_lists.find(item => item.delivery_order_list.barcode === data)
    return itemId.id
  }

  onScan(code: string) {
    code = code.trim();

    //Check code include data
    const codeInclude = this.data?.delivery_order_list_items.find((item: any) => item.barcode == code);
    if (!codeInclude) {
      this.toastr.error(this.translocoService.translate('toastr.not_found'));
      return;
    }

    //Check dupliacate barcode in list
    if (this.barcodeList.map(e => e.barcode).includes(code)) {
      this.toastr.error(this.translocoService.translate('toastr.duplicate_barcode'));
      return;
    }

    this.barcodeList.push(codeInclude);
  }
}


