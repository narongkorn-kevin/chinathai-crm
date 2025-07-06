import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderStatusLabel',
    standalone: true
})

export class OrderStatusPipe implements PipeTransform {
    status = [
        { key: "select_payment", value: "เลือกช่องทางชำระ" },
        { key: "wait_payment", value: "รอชำระ" },
        { key: "complete", value: "สำเร็จ" },
        { key: "incomplete", value: "ไม่สำเร็จ" },
        { key: "void ", value: "ยกเลิก" },
      ];
    
      transform(value: unknown, ...args: unknown[]): unknown {
        const text = this.status.find((s) => s.key == value);
        return text ? text.value : value;
      }
}