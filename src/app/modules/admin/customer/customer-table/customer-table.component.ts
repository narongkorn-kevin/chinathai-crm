import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { map, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'asha-customer-table',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatIcon,
    MatIconModule,
    DataTablesModule,
    MatInputModule,
  ],
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
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.scss'
})
export class CustomerTableComponent implements OnInit, AfterViewInit {
  filterForm: FormGroup;
  showFilterForm: boolean = false;

  dataRow: any[] = [];

  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  formFieldHelpers: string[] = ['fuse-mat-dense'];

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  constructor(
    public dialog: MatDialog,
    private _fb: FormBuilder,
  ) {
    this.filterForm = this._fb.group({

    });
  }

  ngOnInit(): void {
    setTimeout(() => this.loadTable());
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dtTrigger.next(this.dtOptions);
    }, 200);
  }

  protected _onDestroy = new Subject<void>();

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onChangeType() {
    this.rerender();
  }


  loadTable(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: false,
      scrollX: true,
      columns: [
        {
          title: 'รหัสลูกค้า',
          data: null,
          defaultContent: '-',
          className: 'text-center',
        },
        {
          title: 'ชื่อลูกค้า',
          data: null,
          defaultContent: '-',
          className: 'text-center',
        },
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

  openfillter() {
    this.showFilterForm = !this.showFilterForm;
  }

  clearFilter() {
    this.filterForm.reset();
    this.rerender();
  }
}
