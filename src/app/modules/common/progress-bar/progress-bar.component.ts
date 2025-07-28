import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asha-progress-bar',
    standalone: true,
    imports: [TranslocoModule, CommonModule],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent {
    @Input() total: number = 100; // ค่ารวมสูงสุด
    @Input() value: number = 0; // ค่าปัจจุบัน
    @Input() color: string = 'bg-red-600'; // สีของ progress bar

    get progressWidth(): string {
        return `${(this.value / this.total) * 100}%`;
    }
    get barColor(): string {
        if (this.value >= this.total) {
            return 'bg-green-600';
        }
        return this.color || 'bg-red-600'; // fallback default
    }
}
