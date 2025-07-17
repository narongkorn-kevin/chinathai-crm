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
  selector: "app-stock-po-detail-detail",
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
export class DetailComponent implements OnInit, AfterViewInit, OnDestroy {
  dtOptions_1: any = {};
  dtTrigger_1: Subject<ADTSettings> = new Subject<ADTSettings>();
  dtOptions_2: any = {};
  dtTrigger_2: Subject<ADTSettings> = new Subject<ADTSettings>();
  dtOptions_3: any = {};
  dtTrigger_3: Subject<ADTSettings> = new Subject<ADTSettings>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  selectedTab: string = "รายละเอียดใบรับเข้าคลัง/PO";

  constructor(
    private fuseConfirmationService: FuseConfirmationService,
    private toastr: ToastrService,
    private _service: PoService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.loadTable1();
    this.loadTable2();
  }

  selectTab(tab: string): void {
    console.log("Selected tab:", tab); // Debugging tab selection
    this.selectedTab = tab;
    this.rerender();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger_1.next(this.dtOptions_1);
      this.dtTrigger_2.next(this.dtOptions_2);
    }, 200);
  }

  ngOnDestroy(): void {
    this.dtTrigger_1.unsubscribe();
    this.dtTrigger_2.unsubscribe();
  }

  loadTable1(): void {
    this.dtOptions_1 = {
      pagingType: "full_numbers",
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this._service.datatable(dataTablesParameters).subscribe({
          next: (resp: any) => {
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
          title: "วันที่เข้าโกดัง",
          data: "createdAt",
          ngPipeInstance: this.datePipe,
          ngPipeArgs: ["yyyy-MM-dd"],
          className: "w-32 text-center",
        },
        {
          title: "ใบรับเข้าคลัง",
          data: "change",
          className: "text-start",
        },
      ],
      headerCallback: (thead, data, start, end, display) => {
        // Apply gray background to header
        $(thead).find("th").css("background-color", "#f2f2f2");
      },
    };
  }

  loadTable2(): void {
    this.dtOptions_2 = {
      pagingType: "full_numbers",
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this._service.datatable(dataTablesParameters).subscribe({
          next: (resp: any) => {
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
          title: "รูปสินค้า",
          data: "no",
          className: "w-15 text-center",
        },
        {
          title: "ประเภท",
          data: "change",
          className: "text-center",
        },
        {
          title: "ชื่อผลิตภัณฑ์",
          data: "cash",
          className: "text-center",
        },
        {
          title: "รูปแบบบรรจุภัณฑ์",
          data: "cash",
          className: "text-center",
        },
        {
          title: "โลโก้",
          data: "cash",
          className: "text-center",
        },
        {
          title: "จำนวนลัง",
          data: "cash",
          className: "text-center",
        },
        {
          title: "จำนวนชิ้น",
          data: "cash",
          className: "text-center",
        },
        {
          title: "น้ำหนัก",
          data: "cash",
          className: "text-center",
        },
        {
          title: "CBM",
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
        this.dtTrigger_1.next(this.dtOptions_1);
        this.dtTrigger_2.next(this.dtOptions_2);
      });
    }
  }
}
