import { map, Subject, Subscription, forkJoin, takeUntil } from 'rxjs';
import {
    Component,
    OnInit,
    OnChanges,
    Inject,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
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
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { CreditService } from '../credit.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { DeliveryOrdersService } from '../delivery-orders.service';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    MatDatepicker,
    MatDatepickerModule,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
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
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { data } from 'jquery';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-user-setting',
    standalone: true,
    templateUrl: './setting.component.html',
    styleUrl: './setting.component.scss',
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
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatSelectModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatDatepickerModule,
        MatCheckbox,
        MatDivider,
        MatIcon,
        MatSelectModule,
        ImageUploadComponent,
        RouterLink,
    ],
})
export class SettingComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    filterForm: FormGroup;
    edit = true;
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    dataRow: any[] = [];
    form: FormGroup;

    constructor(
        private translocoService: TranslocoService,
        private FormBuilder: FormBuilder,
        public _service: DeliveryOrdersService,
        private fuseConfirmationService: FuseConfirmationService,
        private Service: DeliveryOrdersService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        private ChangeDetectorRef: ChangeDetectorRef
    ) {
        this.filterForm = this.FormBuilder.group({
            name: [''],
        });
        this.form = this.FormBuilder.group({
            data: this.FormBuilder.array([]),
        });
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    languageUrl: any;
    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        if (this.langues === 'en') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/en-gb.json';
        } else if (this.langues === 'th') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        } else if (this.langues === 'cn') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh.json';
        } else {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        }
        // setTimeout(() => this.loadTable());
        this.loaddata();

        this.filterForm.get('name').valueChanges.subscribe((value) => {
            if (!value) {
                this.loaddata();
                return;
            }

            this.dataRow = this.dataRow.filter((item) =>
                item.name.includes(value)
            );
        });
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }

    onChangeType() {
        this.rerender();
    }
    rows: any[] = [];

    loaddata() {
        this._service.getsetting().subscribe({
            next: (resp: any) => {
                this.dataRow = resp.data;
                this.populateFormArray();
            },
        });
    }

    loadTable(): void {
        const menuTitles = {
            item: {
                th: 'รายการ',
                en: 'Item',
                cn: '项目',
            },
            width: {
                th: 'กว้าง',
                en: 'Width',
                cn: '宽度',
            },
            length: {
                th: 'ยาว',
                en: 'Length',
                cn: '长度',
            },
            height: {
                th: 'สูง',
                en: 'Height',
                cn: '高度',
            },
        };
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            searching: false,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                this._service
                    .datatablesetting(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            this.dataRow = resp.data;
                            this.populateFormArray();
                            callback({
                                recordsTotal: resp.total,
                                recordsFiltered: resp.total,
                                data: resp.data,
                            });
                        },
                    });
            },
            columns: [
                {
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                },
                {
                    title: menuTitles.item[this.langues],
                    data: 'name',
                    className: 'text-center',
                },
                {
                    title: menuTitles.width[this.langues],
                    data: 'width',
                    className: 'text-center',
                },
                {
                    title: menuTitles.length[this.langues],
                    data: 'long',
                    className: 'text-center',
                },
                {
                    title: menuTitles.height[this.langues],
                    data: 'height',
                    className: 'text-center',
                },
            ],
        };
    }

    populateFormArray(): void {
        const formArray = this.form.get('data') as FormArray;
        formArray.clear();
        this.dataRow.forEach((row) => {
            formArray.push(
                this.FormBuilder.group({
                    id: [row.id, Validators.required],
                    name: [row.name, Validators.required],
                    width: [row.width, Validators.required],
                    long: [row.long, Validators.required],
                    height: [row.height, Validators.required],
                    weight: [row.weight, Validators.required],
                })
            );
        });
        console.log('form', this.form.value);
    }

    get dataFormArray(): FormArray {
        return this.form.get('data') as FormArray;
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }

    openForm() {
        this.edit = !this.edit;
        this.loaddata();
    }

    opendialogdelete(id?: number) {
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate(
                'confirmation.delete_title2'
            ),
            message: this.translocoService.translate(
                'confirmation.delete_message2'
            ),
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            },
            actions: {
                confirm: {
                    show: true,
                    label: this.translocoService.translate(
                        'confirmation.confirm_button'
                    ),
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: this.translocoService.translate(
                        'confirmation.cancel_button'
                    ),
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this._service.deletesetting(id).subscribe({
                    error: (err) => {
                        this.toastr.error(
                            'ลบรายการล้มเหลว โปรดลองใหม่อีกครั้งภายหลัง'
                        );
                        console.log(err, 'err');
                    },
                    complete: () => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.delete')
                        );
                        this.loaddata();
                        this.ChangeDetectorRef.detectChanges();
                    },
                });
            }
        });
    }
    Submit() {

        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }

        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate('confirmation.save_title'),
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'primary',
            },
            actions: {
                confirm: {
                    show: true,
                    label: this.translocoService.translate(
                        'confirmation.confirm_button'
                    ),
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: this.translocoService.translate(
                        'confirmation.cancel_button'
                    ),
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const dataArray = this.dataFormArray.controls.map(
                    (control) => ({
                        id: control.get('id').value,
                        name: control.get('name').value,
                        width: control.get('width').value,
                        height: control.get('height').value,
                        long: control.get('long').value,
                        weight: control.get('weight').value,
                    })
                );

                const updateObservables = dataArray.map((data) =>
                    this.Service.updatesetting(data, data.id)
                );

                forkJoin(updateObservables).subscribe({
                    next: () => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.success')
                        );
                        this.edit = !this.edit;
                        this.loaddata();
                    },
                    error: () => {
                        this.toastr.error(
                            this.translocoService.translate('toastr.error')
                        );
                    },
                });
            }
        });
    }

    addStandardItem() {
        // Create default data for the new standard size
        const newItemData = {
            name: 'ขนาดมาตรฐาน ' + (this.dataRow.length + 1),
            width: '0',
            long: '0',
            height: '0',
            weight: '0',
        };

        // Immediately send the create request to the API
        this.Service.creatstandard_size(newItemData).subscribe({
            next: (resp) => {
                this.toastr.success(
                    this.translocoService.translate('toastr.add')
                );

                // Toggle to edit mode if not already in it
                if (this.edit) {
                    this.edit = false;
                }

                // Reload the data to include the new item
                this.loaddata();
            },
            error: (err) => {
                this.toastr.error(
                    this.translocoService.translate('toastr.add_error')
                );
                console.error('Error creating standard size:', err);
            },
        });
    }
}
