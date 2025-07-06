import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderProductsService } from 'app/modules/admin/order-products/order-products.service';
import { map, ReplaySubject, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'asha-select-member',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
    templateUrl: './select-member.component.html',
    styleUrl: './select-member.component.scss'
})
export class SelectMemberComponent {

    @Output() change = new EventEmitter<any>();

    filterMember: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    memberFilter = new FormControl('');

    members: any[] = [];

    protected _onDestroy = new Subject<void>();

    constructor(
        private readonly _service: OrderProductsService
    ) { }

    ngOnInit(): void {
        this._service.getMember()
            .pipe(
                map((resp: { data: any[] }) => ({
                    ...resp,
                    data: resp.data.map(e => ({
                        ...e,
                        fullname: `${e.code} ${e.fname} ${e.lname}`
                    }))
                }))
            )
            .subscribe((member: { data: any[] }) => {
                this.members = member.data;

                this.filterMember.next(this.members);
            });

        this.memberFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterEmployee();
            });
    }

    onSelectMember(event: any) {
        if (!event) {
            if (this.memberFilter.invalid) {
                this.memberFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No Approver Selected');
            return;
        }

        const selectedData = event; // event จะเป็นออบเจ็กต์ item

        if (selectedData) {
            this.change.emit(selectedData);

            this.memberFilter.setValue(selectedData.fullname);
        } else {
            if (this.memberFilter.invalid) {
                this.memberFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No Approver Found');
            return;
        }
    }

    protected _filterEmployee() {
        if (!this.members) {
            return;
        }

        const search = this.memberFilter.value;

        if (!search) {
            this.filterMember.next(this.members.slice());
            return;
        }

        // กรองข้อมูลโดยค้นหาใน firstname และ lastname
        this.filterMember.next(
            this.members.filter(item => item.fullname.includes(search))
        );
    }
}
