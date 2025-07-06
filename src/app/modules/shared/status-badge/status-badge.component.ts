import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  standalone: true,
    imports: [
    CommonModule  // ✅ ใส่ CommonModule ตรงนี้
  ],
})
export class StatusBadgeComponent {
  @Input() status: string = 'waiting'; // ค่า default

  get color(): string {
    switch (this.status) {
      case 'waiting': return 'bg-orange-500 ring-orange-200';
      case 'wait_customer': return 'bg-orange-500 ring-orange-200';
      case 'pending': return 'bg-blue-500 ring-blue-200';
      case 'wait_payment': return 'bg-blue-500 ring-blue-200';
      case 'wait_approve': return 'bg-blue-500 ring-blue-200';
      case 'processing': return 'bg-blue-500 ring-blue-200';
      case 'success': return 'bg-green-500 ring-green-200';
      case 'approved': return 'bg-green-500 ring-green-200';
      case 'error': return 'bg-red-500 ring-red-200';
      case 'canceled': return 'bg-red-500 ring-red-200';
      default: return 'bg-gray-400 ring-gray-200';
    }
  }

  get label(): string {
    switch (this.status) {
      case 'waiting': return 'รอตรวจสอบ';
      case 'pending': return 'กำลังตรวจสอบ';
      case 'canceled': return 'ยกเลิก';
      case 'wait_customer': return 'รอลูกค้าจ่าย';
      case 'wait_payment': return 'รอจ่ายร้านจีน';
      case 'wait_approve': return 'รอใส่เลขแทรคกิ้ง';
      case 'processing': return 'กำลังดำเนินการ';
      case 'approved': return 'เสร็จสิ้น';
      case 'success': return 'เสร็จสิ้น';
      case 'error': return 'เกิดข้อผิดพลาด';
      default: return 'ไม่ทราบสถานะ';
    }
  }
}
