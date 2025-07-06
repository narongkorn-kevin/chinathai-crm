// dynamic-dialog.component.ts
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface DialogData {
    title?: string;
    message?: string;
    type?: 'cancel_order' | 'change_po' | 'confirm';
    error?: string;
    reason?: string;
    selectedUser?: string;
    userList?: string[];
}

@Component({
    selector: 'app-dynamic-dialog',
    templateUrl: './dynamic-dialog.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogTitle,
        MatDialogActions,
        MatDialogContent,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ]
})
export class DynamicDialogComponent {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    constructor(
        public dialogRef: MatDialogRef<DynamicDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

    onCancel(): void {
        this.dialogRef.close({ confirmed: false });
    }

    onConfirm(): void {
        this.dialogRef.close({
            confirmed: true,
            data: {
                reason: this.data.reason,
                selectedUser: this.data.selectedUser
            }
        });
    }
}