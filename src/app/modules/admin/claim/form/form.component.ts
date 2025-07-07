import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-claim-form',
    templateUrl: './form.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule
    ]
})
export class ClaimFormComponent {
    claimGroups = [
        {
            seller: '小妍妍08',
            products: [
                {
                    sku: 'HK06',
                    description: '均码款',
                    price: 56.10,
                    qty: 1,
                    total: 56.10,
                    claimQty: 1,
                    approveQty: 0,
                    approvePrice: 0.00,
                    remark: ''
                }
            ]
        },
        {
            seller: '桥贝1',
            products: [
                {
                    sku: '杜鹃花色',
                    description: 'L',
                    price: 62.73,
                    qty: 1,
                    total: 62.73,
                    claimQty: 1,
                    approveQty: 0,
                    approvePrice: 0.00,
                    remark: ''
                }
            ]
        }
    ];

    summary = {
        cncn: 0.00,
        cnth: 0.00,
        status: 'cancel'
    };

    get totalAmount(): number {
        return this.claimGroups.flatMap(group => group.products).reduce((sum, p) => sum + p.total, 0);
    }

    get totalClaimQty(): number {
        return this.claimGroups.flatMap(group => group.products).reduce((sum, p) => sum + p.claimQty, 0);
    }

    get totalApproveQty(): number {
        return this.claimGroups.flatMap(group => group.products).reduce((sum, p) => sum + p.approveQty, 0);
    }
}
