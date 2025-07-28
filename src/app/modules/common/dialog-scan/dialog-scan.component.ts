import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-dialog-scan',
    standalone: true,
    templateUrl: './dialog-scan.component.html',
    styleUrls: ['./dialog-scan.component.scss'],
    imports: [
        TranslocoModule,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatRadioModule,
    ],
})
export class DialogScanComponent {
    searchValue: string = '';
    filteredItems: any[] = [];
    rawdata: any[] = [];
    selectedItem: any = null;
    type: string;

    constructor(
        public dialogRef: MatDialogRef<DialogScanComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.filteredItems = data.value;
        this.rawdata = data.value;
        this.type = data.type;
        if (this.type === 'tracking') {
            this.filteredItems = data.value.map((item: any) => {
                return {
                    code: item.track_no,
                    date: item.date,
                    id: item.id,
                };
            });
            this.rawdata = data.value.map((item: any) => {
                return {
                    code: item.track_no,
                    date: item.date,
                    id: item.id,
                };
            });
        } else {
            this.filteredItems = data.value;
        }
    }
    ngOnInit(): void {}

    onSearch() {
        setTimeout(() => {
            if (this.searchValue) {
                this.filteredItems = this.rawdata.filter((item: any) => {
                    const match =
                        item.code &&
                        item.code
                            .toLowerCase()
                            .includes(this.searchValue.toLowerCase());
                    return match;
                });
                if (this.filteredItems.length === 1) {
                    this.dialogRef.close(this.filteredItems[0]);
                }
            } else {
                this.filteredItems = [];
            }
        }, 500);
    }

    onSelect(item: any) {
        this.selectedItem = item;
    }

    onConfirm() {
        if (this.selectedItem) {
            this.dialogRef.close(this.selectedItem);
        }
    }

    onClose() {
        this.dialogRef.close();
    }
}
