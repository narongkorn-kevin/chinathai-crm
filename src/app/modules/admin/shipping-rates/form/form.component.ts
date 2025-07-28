import { Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIcon, MatIconModule } from '@angular/material/icon';
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
    FormArray,
    AbstractControl,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

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
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { LocationService } from 'app/location.service';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { serialize } from 'object-to-formdata';
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { UploadFileComponent } from '../../../common/upload-file/upload-file.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-member-form',
    standalone: true,
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
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
        MatCheckbox,
        MatDivider,
        MatIcon,
        MatSelectModule,
        ImageUploadComponent,
        RouterLink,
        MatMenuModule,
        MatDividerModule,
        UploadFileComponent,
    ],
    animations: [
        trigger('slideToggle', [
            state(
                'open',
                style({
                    height: '*',
                    opacity: 1,
                    overflow: 'hidden',
                })
            ),
            state(
                'closed',
                style({
                    height: '0px',
                    opacity: 0,
                    overflow: 'hidden',
                })
            ),
            transition('open <=> closed', [animate('300ms ease-in-out')]),
        ]),
    ],
})
export class FormComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    form: FormGroup;
    type: string;
    data: any;

    // Define shipping zones and shipping types
    shippingZones = ['A', 'ABCD', 'B', 'C', 'CB', 'CD', 'CF', 'D'];
    shippingTypes = ['SEA', 'EK', 'RW'];
    langues: any;
    lang: String;
    languageUrl: any;
    typeTransport: any[] = []
    constructor(
        private translocoService: TranslocoService,
        private FormBuilder: FormBuilder,
        public _service: ShippingRatesService,
        private fuseConfirmationService: FuseConfirmationService,
        private memberService: ShippingRatesService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
    ) {
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
        this.type = this.activated.snapshot.data.type;
        if (this.type === 'EDIT') {
            this.data = this.activated.snapshot.data.itemData.data;
            this.patchFormValues()
        }
        this.shippingTypes = this.activated.snapshot.data.transport.data;
        this.shippingZones = this.activated.snapshot.data.productType.data;



        // Initialize the form arrays with default data
        // this.initShippingRates();
    }

    ngOnInit(): void {
        // If editing, load data into form
        if (this.type === 'EDIT' && this.data) {
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

            this.form = this.FormBuilder.group({
                code: this.data.code,
                name:this.data.name,
                min_rate: this.data.min_rate,
                remark:this.data.remark,
                transport_type: this.FormBuilder.array(
                    this.shippingTypes.map((tid: any) => {
                        const matched = this.typeTransport.find((t: any) => t.transport_type_id === tid.id);

                        return this.FormBuilder.group({
                            transport_type_id: [tid.id],
                            cbm: this.FormBuilder.array(
                                this.shippingZones.map((pid: any) => {
                                    const cbmRate = matched?.cbm.find((r: any) => r.product_type_id === pid.id);
                                    return this.FormBuilder.group({
                                        product_type_id: [pid.id],
                                        rate_price: [cbmRate?.rate_price ?? 0.00]
                                    });
                                })
                            ),
                            kg: this.FormBuilder.array(
                                this.shippingZones.map((pid: any) => {
                                    const kgRate = matched?.kg.find((r: any) => r.product_type_id === pid.id);
                                    return this.FormBuilder.group({
                                        product_type_id: [pid.id],
                                        rate_price: [kgRate?.rate_price ?? 0.00]
                                    });
                                })
                            )
                        });
                    })
                )
            });

        } else {
            this.form = this.FormBuilder.group({
                code: [''],
                name: [''],
                min_rate: [0.00],
                remark: [''],
                transport_type: this.FormBuilder.array(
                    this.shippingTypes.map((tid: any) =>
                        this.FormBuilder.group({
                            transport_type_id: [tid.id],
                            cbm: this.FormBuilder.array(
                                this.shippingZones.map((pid: any) =>
                                    this.FormBuilder.group({
                                        product_type_id: [pid.id],
                                        rate_price: [0.00]
                                    })
                                )
                            ),
                            kg: this.FormBuilder.array(
                                this.shippingZones.map((pid: any) =>
                                    this.FormBuilder.group({
                                        product_type_id: [pid.id],
                                        rate_price: [0.00]
                                    })
                                )
                            )
                        })
                    )
                )
            });
        }

        console.log(this.form.value);

    }

    get transportTypes(): FormArray {
        return this.form.get('transport_type') as FormArray;
    }

    getCBMArray(i: number): FormArray {
        return (this.transportTypes.at(i).get('cbm') as FormArray);
    }

    getKGArray(i: number): FormArray {
        return (this.transportTypes.at(i).get('kg') as FormArray);
    }

    getRateControl(array: AbstractControl | null, productTypeId: number): FormGroup | null {
        if (!array || !(array instanceof FormArray)) return null;

        const group = (array as FormArray).controls.find(ctrl => ctrl.get('product_type_id')?.value === productTypeId);
        return group as FormGroup || null;
    }

    // Initialize shipping rates form arrays with default values


    // Patch form values if editing existing data
    patchFormValues(): void {
        // this.form.patchValue({
        //     code: this.data.code || '',
        //     name: this.data.name || '',
        //     min_rate: this.data.min_rate || '',
        //     remark: this.data.remark || '',
        // });

        // if (this.data.shipping_rates) {
        // }
    }

    Submit() {
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }
        const Datacon = {
            pleaseconfirm: { th: 'ยืนยันการบันทึกข้อมูล', en: 'Confirm data recording', cn: '确认保存数据' },
            confirm: { th: 'ยืนยัน', en: 'Confirm', cn: '确认' },
            cancel: { th: 'ยกเลิก', en: 'Cancel', cn: '取消' },
            pleasefill: { th: 'กรุณากรอกข้อมูลให้ครบถ้วน', en: 'Please fill in all required fields', cn: '请填写完整信息' },
            errorsave: { th: 'ไม่สามารถบันทึกข้อมูลได้', en: 'Unable to save data', cn: '无法保存数据' },
            successadd: { th: 'ดำเนินการเพิ่มข้อมูลสำเร็จ', en: 'Successfully added data', cn: '成功添加数据' },
            successedit: { th: 'ดำเนินการแก้ไขข้อมูลสำเร็จ', en: 'Successfully edited data', cn: '成功编辑数据' },
        };

        const formValue = {
            ...this.form.value,
        };

        const confirmation = this.fuseConfirmationService.open({
            title: Datacon.pleaseconfirm[this.langues],
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'primary',
            },
            actions: {
                confirm: {
                    show: true,
                    label: Datacon.confirm[this.langues],
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: Datacon.cancel[this.langues],
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                if (this.type === 'NEW') {
                    this._service.create(formValue).subscribe({
                        error: (err) => {
                            this.toastr.error(Datacon.errorsave[this.langues]);
                        },
                        complete: () => {
                            this.toastr.success(Datacon.successadd[this.langues]);
                            this._router.navigate(['shipping-rates']);
                        },
                    });
                } else {
                    this._service
                        .update(this.data.id, formValue)
                        .subscribe({
                            error: (err) => {
                                this.toastr.error(Datacon.errorsave[this.langues]);
                            },
                            complete: () => {
                                this.toastr.success(
                                    Datacon.successedit[this.langues]
                                );
                                this._router.navigate(['shipping-rates']);
                            },
                        });
                }
            }
        });
    }

    Close() {
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
}
