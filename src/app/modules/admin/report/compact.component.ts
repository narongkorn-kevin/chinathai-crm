import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ReportService } from './page.service';
import { ActivatedRoute } from '@angular/router';

export interface Order {
    id: number;
    createdAt: string;
    orderNo: string;
    orederDate: string;
    orderStatus: string;
    total: number;
    discount: number;
    grandTotal: number;
    orderItems: [
        {
            id: number;
            createdAt: string;
            updatedAt: string;
            deletedAt: string;
            quantity: number
            price: number
            total: number
            product: {
                id: number
                createdAt: string;
                updatedAt: string;
                deletedAt: string;
                code: string;
                name: string;
                image: string;
                price: number
                category: {
                    id: number
                    createdAt: string;
                    updatedAt: string;
                    deletedAt: string;
                    code: string;
                    name: string;
                }
            },
            attributes: []
        }
    ]
}

@Component({
    selector: 'compact',
    templateUrl: './compact.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CdkScrollable],
})
export class CompactComponent {

    Id: any;
    itemData: Order;
    /**
     * Constructor
     */
    constructor(
        private _service: ReportService,
        private _activateRoute: ActivatedRoute
    ) {
        this.Id = this._activateRoute.snapshot.params.id;
        this._service.getById(this.Id).subscribe((resp: Order) => {
            this.itemData = resp
        })
    }
}
