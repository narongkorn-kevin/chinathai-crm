import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-image-viewer',
    standalone: true,
    imports: [TranslocoModule, CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './image-viewer.component.html',
    styleUrl: './image-viewer.component.scss',
})
export class ImageViewerComponent implements OnInit, AfterViewInit {
    @ViewChild('imageContainer') imageContainer: ElementRef;

    imageUrl: string;
    zoomLevel: number = 100;
    imageError: boolean = false;

    // ตัวแปรสำหรับการลากรูป
    isDragging: boolean = false;
    lastX: number = 0;
    lastY: number = 0;
    positionX: number = 0;
    positionY: number = 0;
    transformOrigin: string = 'center center';

    constructor(
        public dialogRef: MatDialogRef<ImageViewerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }
    ) {
        this.imageUrl = data.imageUrl;
    }

    ngOnInit(): void {
        // ตั้งค่า dialog ให้ปิดได้เมื่อคลิกที่พื้นหลัง
        this.dialogRef.backdropClick().subscribe(() => this.closeDialog());

        // เพิ่ม event listeners สำหรับการลากรูป
        window.addEventListener('mousemove', this.onDrag.bind(this));
        window.addEventListener('mouseup', this.stopDrag.bind(this));
        window.addEventListener('touchmove', this.onTouchDrag.bind(this));
        window.addEventListener('touchend', this.stopDrag.bind(this));
    }

    ngAfterViewInit(): void {
        // กำหนดตำแหน่งเริ่มต้นของรูปให้อยู่ตรงกลาง
        setTimeout(() => {
            this.centerImage();
        }, 100);
    }

    ngOnDestroy(): void {
        // ลบ event listeners เมื่อ component ถูกทำลาย
        window.removeEventListener('mousemove', this.onDrag.bind(this));
        window.removeEventListener('mouseup', this.stopDrag.bind(this));
        window.removeEventListener('touchmove', this.onTouchDrag.bind(this));
        window.removeEventListener('touchend', this.stopDrag.bind(this));
    }

    centerImage(): void {
        const container = this.imageContainer.nativeElement.parentElement;
        if (container) {
            const containerRect = container.getBoundingClientRect();
            this.positionX =
                containerRect.width / 2 -
                this.imageContainer.nativeElement.offsetWidth / 2;
            this.positionY =
                containerRect.height / 2 -
                this.imageContainer.nativeElement.offsetHeight / 2;
        }
    }

    zoomIn(): void {
        if (this.zoomLevel < 300) {
            this.zoomLevel += 10;
        }
    }

    zoomOut(): void {
        if (this.zoomLevel > 40) {
            this.zoomLevel -= 10;

            // หากซูมออกมากจนเกินไป ให้จัดกลางรูปภาพใหม่
            if (this.zoomLevel <= 100) {
                this.centerImage();
            }
        }
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    handleImageError(): void {
        this.imageError = true;
        this.imageUrl = '/assets/images/no-image.png'; // Fallback image path
    }

    // เริ่มการลากด้วย mouse
    startDrag(event: MouseEvent): void {
        this.isDragging = true;
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        event.preventDefault();
    }

    // เริ่มการลากด้วย touch
    startTouchDrag(event: TouchEvent): void {
        if (event.touches.length === 1) {
            this.isDragging = true;
            this.lastX = event.touches[0].clientX;
            this.lastY = event.touches[0].clientY;
            event.preventDefault();
        }
    }

    // การลากด้วย mouse
    onDrag(event: MouseEvent): void {
        if (!this.isDragging) return;

        const deltaX = event.clientX - this.lastX;
        const deltaY = event.clientY - this.lastY;

        this.positionX += deltaX;
        this.positionY += deltaY;

        this.lastX = event.clientX;
        this.lastY = event.clientY;
    }

    // การลากด้วย touch
    onTouchDrag(event: TouchEvent): void {
        if (!this.isDragging || event.touches.length !== 1) return;

        const touch = event.touches[0];
        const deltaX = touch.clientX - this.lastX;
        const deltaY = touch.clientY - this.lastY;

        this.positionX += deltaX;
        this.positionY += deltaY;

        this.lastX = touch.clientX;
        this.lastY = touch.clientY;

        event.preventDefault();
    }

    // หยุดการลาก
    stopDrag(): void {
        this.isDragging = false;
    }
}
