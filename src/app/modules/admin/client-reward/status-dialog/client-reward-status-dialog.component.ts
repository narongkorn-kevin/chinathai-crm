import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ClientRewardService } from '../client-reward.service';

export interface ClientRewardStatusDialogData {
    reward: any;
    statusOptions: { value: string; label: string }[];
}

@Component({
    selector: 'app-client-reward-status-dialog',
    standalone: true,
    templateUrl: './client-reward-status-dialog.component.html',
    imports: [
        CommonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
})
export class ClientRewardStatusDialogComponent {
    form: FormGroup;
    submitting = false;

    constructor(
        private _fb: FormBuilder,
        private _dialogRef: MatDialogRef<ClientRewardStatusDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ClientRewardStatusDialogData,
        private _service: ClientRewardService,
        private _toastr: ToastrService,
    ) {
        this.form = this._fb.group({
            status: [data.reward?.status ?? '', Validators.required],
        });
    }

    submit(): void {
        if (this.form.invalid || this.submitting) {
            this.form.markAllAsTouched();
            return;
        }

        this.submitting = true;

        this._service
            .updateStatus(this.data.reward.id, this.form.value.status)
            .pipe(finalize(() => (this.submitting = false)))
            .subscribe({
                next: () => {
                    this._toastr.success('อัปเดตสถานะสำเร็จ');
                    this._dialogRef.close(true);
                },
                error: () => {
                    this._toastr.error('ไม่สามารถอัปเดตสถานะได้');
                },
            });
    }

    cancel(): void {
        this._dialogRef.close();
    }
}
