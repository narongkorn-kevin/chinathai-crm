import { Component, Inject } from '@angular/core';
import { ScanBarcodeComponent } from '../scan-barcode.component';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'asha-scan-barcode-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ScanBarcodeComponent
  ],
  template: `
    <app-scan-barcode (codeScanned)="onCodeScanned($event)"></app-scan-barcode>
  `,
  styles: ``
})
export class ScanBarcodeDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ScanBarcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCodeScanned(code: string) {
    this.dialogRef.close(code);
  }
}
