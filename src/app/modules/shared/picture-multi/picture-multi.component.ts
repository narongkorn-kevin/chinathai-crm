import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'picture-multi',
    templateUrl: './picture-multi.component.html',
    styleUrl: './picture-multi.component.scss',
    // encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatIconModule

    ],
    standalone: true,
})
export class PictureMultiComponent {
    currentIndex = 0;

    constructor(
        public dialogRef: MatDialogRef<PictureMultiComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { images: string[], selectedIndex: number }
    )
    {     
        this.currentIndex = data.selectedIndex;
    }

    prev() {
        if (this.currentIndex > 0) this.currentIndex--;
    }

    next() {
        if (this.currentIndex < this.data.images.length - 1) this.currentIndex++;
    }

    close() {
        this.dialogRef.close();
    }
}


