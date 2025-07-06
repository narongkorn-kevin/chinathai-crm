import { data } from 'jquery';
import { map, Subject, Subscription } from 'rxjs';
import {
    Component,
    OnInit,
    OnChanges,
    Inject,
    ChangeDetectorRef,
    ViewChild,
    ChangeDetectionStrategy,
    AfterViewInit,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { createFileFromBlob } from 'app/modules/shared/helper';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    MatDatepicker,
    MatDatepickerModule,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatTableModule } from '@angular/material/table';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { QuillModule } from 'ngx-quill';
import { environment } from 'environments/environment';
import { ManualService } from '../manual/page.service';
import { SettingAppService } from './setting-app.service';

@Component({
    selector: 'app-manual-form',
    standalone: true,
    templateUrl: './setting-app.component.html',
    styleUrl: './setting-app.component.scss',
    imports: [
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
        ImageUploadComponent,
        RouterLink,
        MatTableModule,
        MatCheckboxModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
        CdkMenuModule,
        QuillModule
    ],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SettingAppComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    @ViewChild('btNg') btNg: any;
    @ViewChild('checkboxpo') checkboxpo: any;
    @ViewChild('checkboxtack') checkboxtack: any;
    @ViewChild('dtTacking') dtTacking: DataTableDirective;
    @ViewChild('dtPO') dtPO: DataTableDirective;
    dtTriggertack: Subject<ADTSettings> = new Subject<ADTSettings>();
    dtTriggerpo: Subject<ADTSettings> = new Subject<ADTSettings>();
    dtOptionstack: any = {};
    dtOptionspo: any = {};
    form: FormGroup;
    type: string;
    isIndividual: boolean = true;
    hidePassword = true;
    hideConfirmPassword = true;
    store = [];
    product_type = [];
    standard_size = [];
    tracking = [];
    on_services = [];
    Id: any = ''
    imageUrl: string;
    data: any;
    categoryManual: any[] = []
    datarowtacking = [];
    datarowPo = [];

    editorModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['table'] // รองรับตาราง
            ['clean'],                                         // remove formatting button

            ['link', 'image', 'video']                         // link and image, video
        ]
    };


    constructor(
        private formBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private _Service: SettingAppService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.data = this.activated.snapshot.data?.data?.data;
        console.log('data',this.data);

        this.form = this.formBuilder.group({
            id: this.data.id,
            policy: this.data?.policy,
            term_and_condition: this.data?.term_and_condition,
        });
        console.log('form',this.form);

    }

    ngOnInit(): void {

    }
    ngAfterViewInit() {

    }

    ngOnDestroy(): void {

    }


    backTo() {
        this._router.navigateByUrl('dashboard')
    }

    Submit() {
        const confirmation = this.fuseConfirmationService.open({
            title: "ยืนยันการบันทึกข้อมูล",
            icon: {
                show: true,
                name: "heroicons_outline:exclamation-triangle",
                color: "primary"
            },
            actions: {
                confirm: {
                    show: true,
                    label: "ยืนยัน",
                    color: "primary"
                },
                cancel: {
                    show: true,
                    label: "ยกเลิก"
                }
            },
            dismissible: false
        })

        confirmation.afterClosed().subscribe(
            result => {
                if (result == 'confirmed') {
                    const formvalue = this.form.value
                    this._Service.update(this.form.get('id').value, formvalue ).subscribe({
                        error: (err) => {
                            this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                        },
                        complete: () => {
                            this.toastr.success('ดำเนินการแก้ไขข้อมูลสำเร็จ')
                            this._Service.get().subscribe({
                                next: (res: any) => {
                                    this.data = res.data
                                    this.form = this.formBuilder.group({
                                        id: this.data.id,
                                        policy: this.data?.policy,
                                        term_and_condition: this.data?.term_and_condition,
                                    });
                                },
                                error: (err) => {
                                    this.toastr.error('ไม่สามารถโหลดข้อมูลได้')
                                },
                                complete: () => {
                                    this._changeDetectorRef.markForCheck();
                                }
                            })
                        },
                    });

                }
            }
        )
    }

}
