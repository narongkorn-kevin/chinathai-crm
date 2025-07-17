import { CommonModule, DatePipe } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { Subject } from "rxjs";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { ADTSettings } from "angular-datatables/src/models/settings";
import { PoService } from "../../po.service";

import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

@Component({
  selector: "app-stock-po-detail-barcode",
  standalone: true,
  imports: [
    TranslocoModule,
    CommonModule,
    DataTablesModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
  ],
  templateUrl: "./page.component.html",
  styleUrls: ["./page.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DatePipe],
})
export class BarcodeComponent implements OnInit, AfterViewInit, OnDestroy {
  dtOptions_3: any = {};
  dtTrigger_3: Subject<ADTSettings> = new Subject<ADTSettings>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  constructor(
    private fuseConfirmationService: FuseConfirmationService,
    private toastr: ToastrService,
    private _service: PoService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.loadTable3();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger_3.next(this.dtOptions_3);
    }, 200);
  }

  ngOnDestroy(): void {
    this.dtTrigger_3.unsubscribe();
  }

  loadTable3(): void {
    this.dtOptions_3 = {
      pagingType: "full_numbers",
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this._service.datatable(dataTablesParameters).subscribe({
          next: (resp: any) => {
            console.log("Data loaded for Barcode tab:", resp); // Debugging data loading
            callback({
              recordsTotal: resp.meta.totalItems,
              recordsFiltered: resp.meta.totalItems,
              data: resp.data,
            });
          },
        });
      },
      columns: [
        {
          title: "#",
          data: "no",
          className: "w-15 text-center",
        },
        {
          title: "Tracking",
          data: "change",
          className: "text-center",
        },
        {
          title: "Cargo in",
          data: "cash",
          className: "text-center",
        },
        {
          title: "Cargo out",
          data: "cash",
          className: "text-center",
        },
        {
          title: "Cargo Thai",
          data: "cash",
          className: "text-center",
        },
        {
          title: "Status",
          data: "cash",
          className: "text-center",
        },
      ],
      headerCallback: (thead, data, start, end, display) => {
        // Apply gray background to header
        $(thead).find("th").css("background-color", "#f2f2f2");
      },
    };
  }

  backToPo(): void {
    this._router.navigate(["/po"]);
  }

  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger_3.next(this.dtOptions_3);
      });
    }
  }
}
