import { Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    Validators,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { CreditService } from '../credit.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { ShippingRatesService } from '../shipping-rates.service';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    MatDatepicker,
    MatDatepickerModule,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-member-view-1',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatDivider,
        RouterLink,
    ],
})
export class ViewComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    form: FormGroup;
    dtOptions: DataTables.Settings = {};
    type: string;
    Id: number;
    data: any;
    typeTransport: any[] = []
    shippingZones = ['A', 'ABCD', 'B', 'C', 'CB', 'CD', 'CF', 'D'];
    shippingTypes = ['SEA', 'EK', 'RW'];
    constructor(
        private translocoService: TranslocoService,
        private FormBuilder: FormBuilder,
        public _service: ShippingRatesService,
        private fuseConfirmationService: FuseConfirmationService,
        private userService: ShippingRatesService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data.itemData.data;
        this.shippingTypes = this.activated.snapshot.data.transport.data;
        this.shippingZones = this.activated.snapshot.data.productType.data;

        this.typeTransport = Object.values(
            this.data.rate_lists.reduce((acc, item) => {
                const typeId = item.transport_type_id;

                if (!acc[typeId]) {
                    acc[typeId] = {
                        transport_type_id: typeId,
                        cbm: [],
                        kg: []
                    };
                }

                if (item.rate_type === 'cbm') {
                    acc[typeId].cbm.push(item);
                } else if (item.rate_type === 'kg') {
                    acc[typeId].kg.push(item);
                }

                return acc;
            }, {} as Record<number, any>)
        );
        console.log(this.typeTransport, 'groupedByTransportType');

    }

    ngOnInit(): void { }

    Close() {
        this._router.navigate(['shipping-rates']);
    }

    setDefault() {
        this.toastr.success(this.translocoService.translate('toastr.update'));
        this._router.navigate(['shipping-rates']);
    }

    transportTypeLabel(id: number): string {
        switch (id) {
            case 1: return 'SEA';
            case 2: return 'EK';
            case 3: return 'RW';
            default: return '-';
        }
    }

    findRate(rateArray: any[], zoneId: number): any | null {
        return rateArray.find(r => r.product_type_id === zoneId) ?? null;
    }


}
