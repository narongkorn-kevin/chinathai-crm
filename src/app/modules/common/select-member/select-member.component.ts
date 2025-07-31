// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, Output } from '@angular/core';
// import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { OrderProductsService } from 'app/modules/admin/order-products/order-products.service';
// import { map, ReplaySubject, Subject, takeUntil } from 'rxjs';

// import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

// @Component({
//     selector: 'asha-select-member',
//     standalone: true,
//     imports: [
//         TranslocoModule,
//         CommonModule,
//         FormsModule,
//         ReactiveFormsModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatAutocompleteModule,
//     ],
//     templateUrl: './select-member.component.html',
//     styleUrl: './select-member.component.scss',
// })
// export class SelectMemberComponent {
//     @Output() change = new EventEmitter<any>();

//     filterMember: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
//     memberFilter = new FormControl('');

//     members: any[] = [];

//     protected _onDestroy = new Subject<void>();

//     constructor(private readonly _service: OrderProductsService) {}

//     ngOnInit(): void {
//         this._service
//             .getMember()
//             .pipe(
//                 map((resp: { data: any[] }) => ({
//                     ...resp,
//                     data: resp.data.map((e) => ({
//                         ...e,
//                         fullname: `${e.code} ${e.fname} ${e.lname}`,
//                     })),
//                 }))
//             )
//             .subscribe((member: { data: any[] }) => {
//                 this.members = member.data;

//                 this.filterMember.next(this.members);
//             });

//         this.memberFilter.valueChanges
//             .pipe(takeUntil(this._onDestroy))
//             .subscribe(() => {
//                 this._filterEmployee();
//             });
//     }

//     onSelectMember(event: any) {
//         if (!event) {
//             if (this.memberFilter.invalid) {
//                 this.memberFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
//             }
//             console.log('No Approver Selected');
//             return;
//         }

//         const selectedData = event; // event จะเป็นออบเจ็กต์ item

//         if (selectedData) {
//             this.change.emit(selectedData);

//             this.memberFilter.setValue(selectedData.fullname);
//         } else {
//             if (this.memberFilter.invalid) {
//                 this.memberFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
//             }
//             console.log('No Approver Found');
//             return;
//         }
//     }

//     protected _filterEmployee() {
//         if (!this.members) {
//             return;
//         }

//         const search = this.memberFilter.value;

//         if (!search) {
//             this.filterMember.next(this.members.slice());
//             return;
//         }

//         // กรองข้อมูลโดยค้นหาใน firstname และ lastname
//         this.filterMember.next(
//             this.members.filter((item) => item.fullname.includes(search))
//         );
//     }
// }
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderProductsService } from 'app/modules/admin/order-products/order-products.service';
import { map, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    selector: 'asha-select-member',
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
    ],
    templateUrl: './select-member.component.html',
    styleUrl: './select-member.component.scss',
})
export class SelectMemberComponent implements OnInit {
    @Input() set memberId(id: string | number | null) {
        if (id) {
            this._initialMemberId = id;
            this._setInitialMember();
        }
    }
    @Input() title: string = '';

    @Output() change = new EventEmitter<any>();

    filterMember: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    memberFilter = new FormControl('');
    members: any[] = [];
    protected _onDestroy = new Subject<void>();
    private _initialMemberId: string | number | null = null;

    constructor(private readonly _service: OrderProductsService) {}

    ngOnInit(): void {
        this._loadMembers();

        this.memberFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterEmployee();
            });
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    onSelectMember(event: any) {
        if (!event) {
            if (this.memberFilter.invalid) {
                this.memberFilter.markAsTouched();
            }
            console.log('No Member Selected');
            return;
        }

        const selectedData = event;
        if (selectedData) {
            this.change.emit(selectedData);
            this.memberFilter.setValue(selectedData.fullname);
        } else {
            if (this.memberFilter.invalid) {
                this.memberFilter.markAsTouched();
            }
            console.log('No Member Found');
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

        const searchLower = (search ?? '').toString().toLowerCase();

        this.filterMember.next(
            this.members.filter((item) =>
                item.importer_code.toLowerCase().includes(searchLower)
            )
        );
    }

    private _loadMembers() {
        this._service
            .getMember()
            .pipe(
                map((resp: { data: any[] }) => ({
                    ...resp,
                    data: resp.data.map((e) => ({
                        ...e,
                        fullname: `${e.fname} ${e.lname}`.trim() ,
                    })),
                }))
            )
            .subscribe((member: { data: any[] }) => {
                this.members = member.data;
                this.filterMember.next(this.members);

                if (this._initialMemberId) {
                    this._setInitialMember();
                }
            });
    }

    private _setInitialMember() {
        if (!this._initialMemberId || !this.members.length) {
            return;
        }

        const selectedMember = this.members.find(
            (member) => member.id == this._initialMemberId
        );

        if (selectedMember) {
            this.memberFilter.setValue(selectedMember.fullname);
            this.change.emit(selectedMember);
        }
    }
}
