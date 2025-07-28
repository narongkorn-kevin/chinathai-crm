import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataTablesModule } from 'angular-datatables';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDivider } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { QRCodeModule, QRCodeComponent } from 'angularx-qrcode';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-dialog-qrcode',
    standalone: true,
    templateUrl: './dialog-qrcode.component.html',
    styleUrl: './dialog-qrcode.component.scss',
    imports: [
        TranslocoModule,
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
        MatDivider,
        MatDatepickerModule,
        MatDialogModule,
        QRCodeModule,
    ],
})
export class DialogQRCodeComponent {
    qrCodeValue: string;

    constructor(
        public dialogRef: MatDialogRef<DialogQRCodeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { text: string }
    ) {
        this.qrCodeValue = data.text; // กำหนดค่าที่รับมาเป็น QR Code
    }
    @ViewChild('qrCode') qrCode!: QRCodeComponent;

    qrDataURL: string = '';

    downloadQRCode() {
        // รอให้ QR code render เสร็จก่อน
        setTimeout(() => {
            try {
                // หา canvas element ที่อยู่ใน QR code component
                const canvas = document.querySelector('canvas');

                if (!canvas) {
                    console.error('Cannot find QR code canvas element');
                    return;
                }

                // สร้าง URL จาก canvas
                const dataUrl = canvas.toDataURL('image/png');

                // สร้าง link สำหรับดาวน์โหลด
                const link = document.createElement('a');
                link.download = `qrcode_${Date.now()}.png`;
                link.href = dataUrl;

                // จำลองการคลิกเพื่อดาวน์โหลด
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error downloading QR code:', error);
            }
        }, 100); // รอ 100ms
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
