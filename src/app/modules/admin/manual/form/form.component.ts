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
import { DialogStockInComponent } from '../../dialog/dialog-stock-in/dialog.component';
import { DialogTrackingComponent } from '../../dialog/dialog-tracking/dialog.component';
import { MatTableModule } from '@angular/material/table';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ManualService } from '../page.service';
import { QuillModule } from 'ngx-quill';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-manual-form',
    standalone: true,
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
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
export class FormComponent implements OnInit, AfterViewInit {
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
        private _Service: ManualService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {

        this.categoryManual = this.activated.snapshot.data.categoryManual.data
        this.Id = this.activated.snapshot.params.id

        this.form = this.formBuilder.group({
            id: '',
            category_member_manual_id: '',
            name: '',
            description: '',
            image: '',
            status: '',
        });
    }

    ngOnInit(): void {
        if (this.Id) {

            this._Service.getGetById(this.Id).subscribe((resp: any) => {
                this.form.patchValue({
                    ...resp.data,
                    image: ""
                })
                 this.imageUrl = resp.data.image
                 console.log(this.form.value);
                 
            })

        }
        else {

        }

    }
    ngAfterViewInit() {

    }

    ngOnDestroy(): void {

    }

    uploadSuccess(file: File): void {
        this.form.patchValue({
            image: file
        });
    }

    backTo() {
        this._router.navigateByUrl('manual')
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
                    const formData = serialize({
                        ...this.form.value,
                        category_member_manual_id: this.form.value.category_member_manual_id,
                    });

                    if (!this.Id) {
                        this._Service.create(formData).subscribe({
                            error: (err) => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')

                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')
                                this._router.navigateByUrl('manual')
                            },
                        });
                    } else {
                        this._Service.update(formData).subscribe({
                            error: (err) => {
                                this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการแก้ไขข้อมูลสำเร็จ')
                                this._router.navigateByUrl('manual')
                            },
                        });
                    }
                }
            }
        )
    }

}
