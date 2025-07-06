import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DataTablesModule } from 'angular-datatables';
import { DataTableDirective } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReportService } from '../page.service';
import { MatSelectModule } from '@angular/material/select';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { MatCardModule } from '@angular/material/card';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-card-report',
  standalone: true,
  providers: [DatePipe],
  imports: [CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    MatSelectModule,
    MatCardModule,],
  templateUrl: './card-report.component.html',
  styleUrl: './card-report.component.scss'
})
export class CardReportComponent {
  readonly range = new FormGroup({
    start: new FormControl<any | null>(null),
    end: new FormControl<any | null>(null),
  });
  readonly range1 = new FormGroup({
    start: new FormControl<any | null>(null),
    end: new FormControl<any | null>(null),
  });
  [x: string]: any;
  datePicked: Date | null = null;
  dtOptions: DataTables.Settings = {};
  orders: any[] = [];
  dtElement: DataTableDirective;
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  constructor(
    private datePipe: DatePipe,
    private _service: ReportService,
    public dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _fb: FormBuilder,
    private toastr: ToastrService,
  ) {


  }

  getFormattedDate(): string | null {
    return this.datePicked ? this.datePipe.transform(this.datePicked, 'yyyy-MM-dd') : null;
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      date: ''
    })
  }

  printOriginal() {
    const formattedDate = this.getFormattedDate();
    if (!formattedDate) {
      this.toastr.error('กรุณาเลือกวันที่')
      return;
    }
    if (formattedDate) {
      console.log('date:', formattedDate);
    }
    this.form.patchValue({
      date: formattedDate
    })
    this._service.orderPdf(this.form.value).subscribe({
      next: (resp: Blob) => {
        let fileName = `original_${formattedDate}.xlsx`;
        createFileFromBlob(resp, fileName);
      },
      error: (err) => {
        alert(JSON.stringify(err))
      }
    })
  }




  printSummary() {
    let formValue = this.range.value
    if (formValue.start && formValue.end) {
      var startDate = DateTime.fromISO(formValue.start).toFormat('yyyy-MM-dd');
      var endDate = DateTime.fromISO(formValue.end).toFormat('yyyy-MM-dd');
    }

    if (!startDate || !endDate) {
      this.toastr.error('กรุณาเลือกวันที่')
      return;
    }
  
    
    this._service.tapSummary({ startDate: startDate, endDate: endDate }).subscribe({
      next: (resp) => {
        createFileFromBlob(resp, `summary_${startDate}_${endDate}.xlsx`);
      },
      error: (err) => {
        alert(JSON.stringify(err))
      }
    })
  }
  printSummary3() {
    let formValue = this.range.value
    if (formValue.start && formValue.end) {
      var startDate = DateTime.fromISO(formValue.start).toFormat('yyyy-MM-dd');
      var endDate = DateTime.fromISO(formValue.end).toFormat('yyyy-MM-dd');
    }
    if (!startDate || !endDate) {
      this.toastr.error('กรุณาเลือกวันที่')
      return;
    }
  
    this._service.tapSummaryDetail({ startDate: startDate, endDate: endDate }).subscribe({
      next: (resp) => {
        createFileFromBlob(resp, `summary_${startDate}_${endDate}.xlsx`);
      },
      error: (err) => {
        alert(JSON.stringify(err))
      }
    })
  }
  printTopUpSummary() {
    let formValue = this.range.value
    if (formValue.start && formValue.end) {
      var startDate = DateTime.fromISO(formValue.start).toFormat('yyyy-MM-dd');
      var endDate = DateTime.fromISO(formValue.end).toFormat('yyyy-MM-dd');
    }
    if (!startDate || !endDate) {
      this.toastr.error('กรุณาเลือกวันที่')
      return;
    }
  
    this._service.topupSummary({ startDate: startDate, endDate: endDate }).subscribe({
      next: (resp) => {
        createFileFromBlob(resp, `summary_${startDate}_${endDate}.xlsx`);
      },
      error: (err) => {
        alert(JSON.stringify(err))
      }
    })
  }
  printSummaryCreditToday() {
    let formValue = this.range.value
    if (formValue.start && formValue.end) {
      var startDate = DateTime.fromISO(formValue.start).toFormat('yyyy-MM-dd');
      var endDate = DateTime.fromISO(formValue.end).toFormat('yyyy-MM-dd');
    }
    if (!startDate || !endDate) {
      this.toastr.error('กรุณาเลือกวันที่')
      return;
    }
  
    this._service.creditSummaryToday({ startDate: startDate, endDate: endDate }).subscribe({
      next: (resp) => {
        createFileFromBlob(resp, `summary_${startDate}_${endDate}.xlsx`);
      },
      error: (err) => {
        alert(JSON.stringify(err))
      }
    })
  }
  printSummaryPayment() {
    let formValue = this.range.value
    if (formValue.start && formValue.end) {
      var startDate = DateTime.fromISO(formValue.start).toFormat('yyyy-MM-dd');
      var endDate = DateTime.fromISO(formValue.end).toFormat('yyyy-MM-dd');
    }
    if (!startDate || !endDate) {
      this.toastr.error('กรุณาเลือกวันที่')
      return;
    }
  
    this._service.paymentSummary({ startDate: startDate, endDate: endDate }).subscribe({
      next: (resp) => {
        createFileFromBlob(resp, `summary_${startDate}_${endDate}.xlsx`);
      },
      error: (err) => {
        alert(JSON.stringify(err))
      }
    })
  }
  printSummaryTopup() {
    let formValue = this.range.value
    if (formValue.start && formValue.end) {
      var startDate = DateTime.fromISO(formValue.start).toFormat('yyyy-MM-dd');
      var endDate = DateTime.fromISO(formValue.end).toFormat('yyyy-MM-dd');
    }
    if (!startDate || !endDate) {
      this.toastr.error('กรุณาเลือกวันที่')
      return;
    }
  
    this._service.paymentSummaryTopup({ startDate: startDate, endDate: endDate }).subscribe({
      next: (resp) => {
        createFileFromBlob(resp, `summary_${startDate}_${endDate}.xlsx`);
      },
      error: (err) => {
        alert(JSON.stringify(err))
      }
    })
  }
}
