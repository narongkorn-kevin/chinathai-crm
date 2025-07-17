import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor() {}

  exportTable(tableElement: ElementRef, exportType: 'csv' | 'excel' | 'print' | 'copy') {
    const table = ($(tableElement.nativeElement) as any).DataTable();
    switch (exportType) {
      case 'copy':
        table.button('.buttons-copy').trigger();
        break;
      case 'csv':
        table.button('.buttons-csv').trigger();
        break;
      case 'excel':
        table.button('.buttons-excel').trigger();
        break;
      case 'print':
        table.button('.buttons-print').trigger();
        break;
      default:
        console.error('ประเภทการ export ไม่ถูกต้อง');
    }
  }
}
