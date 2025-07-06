import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'asha-progress-bar',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  @Input() total: number = 100; // ค่ารวมสูงสุด
  @Input() value: number = 0; // ค่าปัจจุบัน
  @Input() color: string = 'bg-blue-600'; // สีของ progress bar

  get progressWidth(): string {
    return `${(this.value / this.total) * 100}%`;
  }
}
