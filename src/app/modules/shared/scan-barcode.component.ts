// scancode-dialog.component.ts
import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    Output,
    EventEmitter,
    ElementRef,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';

export interface ScanCodeResult {
    code: string;
    method: 'scan' | 'manual';
}

@Component({
    selector: 'app-scan-barcode',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslocoModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        ZXingScannerModule,
        ReactiveFormsModule,
    ],
    template: `
        <div class="scancode-dialog border-2 p-2">
            <h2>
                {{ 'scan_barcode.label' | transloco }}
            </h2>

            <div>
                <mat-form-field
                    class="w-full fuse-mat-dense"
                >
                    <mat-select
                        [(ngModel)]="selectedMode"
                        (selectionChange)="onModeChange($event.value)"
                    >
                        <mat-option value="scan">{{
                            'scan_barcode.label' | transloco
                        }}</mat-option>
                        <mat-option value="manual">{{
                            'scan_barcode.manual_input' | transloco
                        }}</mat-option>
                    </mat-select>
                </mat-form-field>

                <ng-container [ngSwitch]="selectedMode">
                    <!-- Scan Mode -->
                    <div *ngSwitchCase="'scan'" class="scan-container">
                        <!-- Select Devices -->
                        <mat-form-field
                            class="w-full fuse-mat-dense"
                        >
                            <mat-select
                                [(ngModel)]="deviceCurrent"
                                (selectionChange)="
                                    onDeviceSelectChange($event.value)
                                "
                            >
                                <mat-option
                                    *ngFor="let device of availableDevices"
                                    [value]="device"
                                    >{{ device.label }}</mat-option
                                >
                            </mat-select>
                        </mat-form-field>

                        <div
                            class="camera-container"
                        >
                            <zxing-scanner
                                #scanner
                                [formats]="allowedFormats"
                                [device]="deviceCurrent"
                                (deviceChange)="onDeviceChange($event)"
                                (scanSuccess)="scanSuccessHandler($event)"
                                (scanError)="scanErrorHandler($event)"
                                (camerasFound)="onCamerasFound($event)"
                            >
                            </zxing-scanner>
                            <div class="scan-overlay">
                                <div class="scan-frame"></div>
                                <p class="scan-instruction">
                                    {{ 'scan_barcode.position' | transloco }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Manual Input Mode -->
                    <div *ngSwitchCase="'manual'" class="manual-container">
                        <mat-form-field class="w-full fuse-mat-dense">
                            <mat-label>{{
                                'scan_barcode.enter_code' | transloco
                            }}</mat-label>
                            <input
                                #myInput
                                matInput
                                [(ngModel)]="manualCode"
                                (keyup.enter)="onManualSubmit()"
                            />
                            <mat-icon matSuffix>edit</mat-icon>
                        </mat-form-field>
                        <div class="manual-actions">
                            <button
                                mat-raised-button
                                color="primary"
                                [disabled]="!manualCode?.trim()"
                                (click)="onManualSubmit()"
                            >
                                <mat-icon>done</mat-icon>
                                {{ 'scan_barcode.use_code' | transloco }}
                            </button>
                        </div>
                    </div>
                </ng-container>
            </div>
        </div>
    `,
    styles: [
        `
            .scancode-dialog {
                width: 100%;
                max-width: 500px;
            }

            .dialog-content {
                padding: 0;
                margin: 0;
                min-height: 400px;
            }

            .scan-container,
            .manual-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .camera-container {
                position: relative;
                width: 100%;
                max-width: 400px;
                border-radius: 8px;
                overflow: hidden;
                background: #000;
            }

            .scan-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.3);
            }

            .scan-frame {
                width: 80%;
                height: 50%;
                border: 3px solid #fff;
                border-radius: 8px;
                position: relative;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
            }

            .scan-frame::before,
            .scan-frame::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
            }

            .scan-frame::before {
                top: -3px;
                left: -3px;
                border-right: none;
                border-bottom: none;
            }

            .scan-frame::after {
                bottom: -3px;
                right: -3px;
                border-left: none;
                border-top: none;
            }

            .scan-instruction {
                color: white;
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
            }

            .scan-result {
                text-align: center;
                padding: 40px 20px;
            }

            .success-icon {
                font-size: 24px;
                color: #4caf50;
                margin-bottom: 16px;
            }

            .detected-code {
                font-family: 'Courier New', monospace;
                font-size: 18px;
                font-weight: bold;
                background: #f5f5f5;
                padding: 12px;
                border-radius: 4px;
                margin: 16px 0;
                word-break: break-all;
            }

            .scan-error {
                text-align: center;
                padding: 40px 20px;
            }

            .error-icon {
                font-size: 64px;
                color: #f44336;
                margin-bottom: 16px;
            }

            .manual-container {
                gap: 20px;
            }

            .full-width {
                width: 100%;
                max-width: 400px;
            }

            .manual-actions {
                width: 100%;
                max-width: 400px;
                display: flex;
                justify-content: center;
            }

            .mat-mdc-tab-group {
                width: 100%;
            }

            .mat-mdc-tab-body-wrapper {
                flex-grow: 1;
            }
        `,
    ],
})
export class ScanBarcodeComponent implements OnInit, OnDestroy {
    beepAudio = new Audio('assets/sound/beep.mp3');
    selectedMode: 'scan' | 'manual' = 'scan';
    scanResult: string | null = null;
    scanError: string | null = null;
    manualCode: string = '';

    allowedFormats = [
        BarcodeFormat.QR_CODE,
        BarcodeFormat.EAN_13,
        BarcodeFormat.CODE_128,
        BarcodeFormat.DATA_MATRIX,
    ];

    @ViewChild('scanner', { static: false })
    scanner: ZXingScannerComponent;

    @ViewChild('myInput') myInput: ElementRef;

    availableDevices: MediaDeviceInfo[];
    deviceCurrent: MediaDeviceInfo;

    @Output() codeScanned = new EventEmitter<string>();

    constructor(private translocoService: TranslocoService) {}

    ngOnInit() {
        // if (this.selectedMode === 'scan') {
        //     this.startScan();
        // }
    }

    ngOnDestroy() {
        // this.stopScan();
    }

    onModeChange(mode: 'scan' | 'manual') {
        this.selectedMode = mode;
        this.scanResult = null;
        this.scanError = null;
        this.manualCode = '';
    }

    resetScan() {
        this.scanResult = null;
        this.scanError = null;
        this.scanner.restart();
    }

    onManualSubmit() {
        if (this.manualCode?.trim()) {
            const result: ScanCodeResult = {
                code: this.manualCode.trim(),
                method: 'manual',
            };
            this.codeScanned.emit(result.code);

            this.manualCode = '';
            this.myInput.nativeElement.focus();
        }
    }

    canSubmit(): boolean {
        return !!(this.scanResult || this.manualCode?.trim());
    }

    onSubmit() {
        const code = this.scanResult || this.manualCode?.trim();
        if (code) {
            const result: ScanCodeResult = {
                code: code,
                method: this.scanResult ? 'scan' : 'manual',
            };
            this.codeScanned.emit(result.code);
        }
    }

    scanCompleteHandler($event: any) {
        console.log('scanCompleteHandler', $event);
    }
    scanFailureHandler($event: any) {
        console.log('scanFailureHandler', $event);
    }
    scanErrorHandler($event: any) {
        console.log('scanErrorHandler', $event);
    }
    scanSuccessHandler($event: any) {
        // เล่นเสียง beep
        this.beepAudio.currentTime = 0; // รีเซ็ตให้เล่นใหม่ได้ทันที
        this.beepAudio.play().catch((e) => {
            console.warn('Beep sound failed to play', e);
        });

        this.scanResult = $event;

        const result: ScanCodeResult = {
            code: this.scanResult,
            method: 'scan',
        };
        this.codeScanned.emit(result.code);
    }
    onCamerasFound(devices: MediaDeviceInfo[]): void {
        this.availableDevices = devices;
    }

    onDeviceSelectChange(device: MediaDeviceInfo) {
        this.deviceCurrent = device || undefined;
    }

    onDeviceChange(device: MediaDeviceInfo) {
        this.deviceCurrent = device || undefined;
    }
}
