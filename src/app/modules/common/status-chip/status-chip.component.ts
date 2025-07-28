import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asha-status-chip',
    standalone: true,
    imports: [TranslocoModule, CommonModule],
    templateUrl: './status-chip.component.html',
    styleUrl: './status-chip.component.scss',
})
export class StatusChipComponent {
    @Input() status: string;

    ngOnInit(): void {
        // console.log('Status chip', this.status);
    }
}
