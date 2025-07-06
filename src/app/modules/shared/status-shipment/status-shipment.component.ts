import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-shipment',
  templateUrl: './status-shipment.component.html',
  standalone: true,
    imports: [
    CommonModule  // ✅ ใส่ CommonModule ตรงนี้
  ],
})
export class StatusShipmentComponent {
  @Input() shipment: string = 'car'; // ค่า default
  
  get label(): string {
    switch (this.shipment) {
      case 'car': return 'ทางรถ';
      case 'ship': return 'ทางเรือ';
      case 'train': return 'ทางรถไฟ';
      default: return 'ไม่ทราบการขนส่ง';
    }
  }
}
