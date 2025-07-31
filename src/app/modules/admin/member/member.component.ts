import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { PictureComponent } from '../picture/picture.component';
import { ProductComposeComponent } from '../product/dialog/product-compose/product-compose.component';
import { MemberService } from './member.service';
// import { MemberComposeComponent } from './dialogcustomer/member-compose.component';
// import { DialogCreditComponent } from './dialog-credit/dialog-credit.component';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ImportexcelComponent } from './import-excel/importexcel.component';
import { MatCheckbox } from '@angular/material/checkbox';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { CdkMenuModule } from '@angular/cdk/menu';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ExportService } from 'app/modules/shared/export.service';
import { FormExcelComponent } from './form-excel/form-excel.component';

@Component({
    selector: 'app-member',
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatCheckbox,
        RouterLink,
        MatIcon,
        CdkMenuModule,
    ],
    providers: [CurrencyPipe, DatePipe],
    animations: [
        trigger('slideToggleFilter', [
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
    templateUrl: './member.component.html',
    styleUrl: './member.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class MemberComponent implements OnInit, AfterViewInit {
    
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dataRow: any[] = [];

    filterForm: FormGroup;
    showFilterForm: boolean = false;
    searchQuery: string = ''

    @ViewChild('btNg') btNg: any;
    @ViewChild('gotoRoute') gotoRoute: any;
    @ViewChild('checkbox_head') checkbox_head: any;
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('date') date: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    category: any[] = ['A', 'B', 'C', 'D'];
    @ViewChild('tableElement') tableElement!: ElementRef;
    constructor(
        private translocoService: TranslocoService,
        private _service: MemberService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private currencyPipe: CurrencyPipe,
        private _router: Router,
        private _fb: FormBuilder,
        private exportService: ExportService,
        private datePipe: DatePipe
    ) {
        this.filterForm = this._fb.group({
            fname: [''],
            lname: [''],
            fullname: [''],
            code: [''],
            phone: [''],
            searchQuery: [''],
        });
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    languageUrl: any;

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
        setTimeout(() => this.loadTable());

        this.filterForm
            .get('searchQuery')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.rerender();
            });

        this.filterForm
            .get('fname')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.rerender();
            });
        this.filterForm
            .get('fullname')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(() => {
                this.rerender();
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
    }

    onChangeType() {
        this.rerender();
    }

    rows: any[] = [];

    loadTable(): void {
        // Define multilingual menu titles
        const menuTitles = {
          customerCode: {
            th: 'รหัสลูกค้า',
            en: 'Customer Code',
            cn: '客户代码',
          },
          firstName: {
            th: 'ชื่อ',
            en: 'First Name',
            cn: '名字',
          },
          lastName: {
            th: 'นามสกุล',
            en: 'Last Name',
            cn: '姓氏',
          },
          phone: {
            th: 'เบอร์โทร',
            en: 'Phone Number',
            cn: '电话号码',
          },
        };

        this.dtOptions = {
          pagingType: 'full_numbers',
          serverSide: true,
          scrollX: true,
          language: {
            url: this.languageUrl,
          },
          ajax: (dataTablesParameters: any, callback) => {
            dataTablesParameters.search = { value: this.filterForm.value.searchQuery };

            const fullName = this.filterForm.value.fullName?.trim() || '';
            if (fullName) {
                const [fname, ...rest] = fullName.split(' ');
                const lname = rest.join(' ') || '';
                dataTablesParameters.fname = fname;
                dataTablesParameters.lname = lname;
  }

            if (this.filterForm.value.code) {
              dataTablesParameters.importer_code = this.filterForm.value.code;
            }
            if (this.filterForm.value.fname) {
              dataTablesParameters.fname = this.filterForm.value.fname;
            }
            if (this.filterForm.value.lname) {
              dataTablesParameters.fname = this.filterForm.value.lname;
            }
            if (this.filterForm.value.phone) {
              dataTablesParameters.phone = this.filterForm.value.phone;
            }

            console.log('📦 Payload:', dataTablesParameters);

            this._service
              .datatable(dataTablesParameters)
              .pipe(map((resp: { data: any }) => resp.data))
              .subscribe({
                next: (resp: any) => {
                  this.dataRow = resp.data;
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
              title: '',
              data: null,
              defaultContent: '',
              ngTemplateRef: {
                ref: this.checkbox,
              },
              className: 'w-10 text-center',
            },
            {
              title: '#',
              data: 'No',
              className: 'w-10 text-center',
            },
            {
              title: menuTitles.customerCode[this.langues],
              data: 'importer_code',
              className: 'w-30 text-left',
              ngTemplateRef: {
                ref: this.gotoRoute,
              },
            },
            {
              title: menuTitles.firstName[this.langues],
              data: 'fname',
              className: 'text-left',
            },
            {
              title: menuTitles.lastName[this.langues],
              data: 'lname',
              className: 'text-left',
            },
            {
              title: menuTitles.phone[this.langues],
              defaultContent: '-',
              data: 'phone',
              className: 'text-left',
            },
          ],
          dom: 'lfrtip',
          buttons: [
            { extend: 'copy', className: 'btn-csv-hidden' },
            { extend: 'csv', className: 'btn-csv-hidden' },
            { extend: 'excel', className: 'btn-csv-hidden' },
            { extend: 'print', className: 'btn-csv-hidden' },
          ],
        };
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
        this._router.navigate(['member/form']);
    }

    openImportExcelDialog() {
        const DialogRef = this.dialog.open(FormExcelComponent, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {},
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    opendialogdelete() {
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate(
                'confirmation.delete_member'
            ),
            message: this.translocoService.translate(
                'confirmation.delete_membermessage'
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
                const id = this.multiSelect;
                console.log(id, 'id');

                for (let i = 0; i < id.length; i++) {
                    this._service.delete(id[i]).subscribe({
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate(
                                    'toastr.delete_error'
                                )
                            );
                            console.log(err, 'err');
                        },
                        complete: () => {
                            if (i == id.length - 1) {
                                this.multiSelect = [];
                                this.toastr.success(
                                    this.translocoService.translate(
                                        'toastr.delete'
                                    )
                                );
                                this.rerender();
                            }
                        },
                    });
                }
                if (id.length === 1) {
                    this.rerender();
                }
            }
        });
    }
    showPicture(imgObject: string): void {
        console.log(imgObject);
        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }
    createProduct() {
        const DialogRef = this.dialog.open(ProductComposeComponent, {
            disableClose: true,
            width: '800px',
            height: '90%',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    multiSelect: any[] = [];
    isAllSelected: boolean = false; // ใช้เก็บสถานะเลือกทั้งหมด

    toggleSelectAll(isSelectAll: boolean): void {
        this.isAllSelected = isSelectAll; // อัปเดตสถานะเลือกทั้งหมด

        if (isSelectAll) {
            // เลือกทั้งหมด: เพิ่ม id ของทุกแถวใน multiSelect
            this.dataRow.forEach((row: any) => {
                if (!this.multiSelect.includes(row.id)) {
                    this.multiSelect.push(row.id); // เพิ่ม id ถ้ายังไม่มีใน multiSelect
                }
                row.selected = true; // ตั้งค่า selected เป็น true
            });
        } else {
            // ยกเลิกการเลือกทั้งหมด: ลบ id ของทุกแถวออกจาก multiSelect
            this.dataRow.forEach((row: any) => {
                const index = this.multiSelect.indexOf(row.id);
                if (index !== -1) {
                    this.multiSelect.splice(index, 1); // ลบ id ออกจาก multiSelect
                }
                row.selected = false; // ตั้งค่า selected เป็น false
            });
        }
    }
    onCheckboxChange(event: any, id: number): void {
        if (event.checked) {
            // เพิ่ม id เข้าไปใน multiSelect
            this.multiSelect.push(id);
        } else {
            // ลบ id ออกจาก multiSelect
            const index = this.multiSelect.indexOf(id);
            if (index !== -1) {
                this.multiSelect.splice(index, 1); // ใช้ splice เพื่อลบค่าออก
            }
        }
    }

    openfillter() {
        // this.filterForm.reset();
        this.showFilterForm = !this.showFilterForm;
    }

    applyFilter() {
        const filterValues = this.filterForm.value;
        console.log(filterValues);
        this.rerender();
    }

    clearFilter() {
        this.filterForm.reset();
        this.rerender();
    }

    exportData(type: 'csv' | 'excel' | 'print' | 'copy') {
        this.exportService.exportTable(this.tableElement, type);
    }
    formatDate(date: Date): string {
        // กำหนด timezone เป็น 'Asia/Bangkok' หรือ timezone ที่ต้องการ
        return this.datePipe.transform(date, 'yyyy-MM-dd', 'Asia/Bangkok');
    }
}
