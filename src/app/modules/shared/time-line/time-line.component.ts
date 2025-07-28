import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { DialogViewImageComponent } from 'app/modules/common/dialog-view-image/dialog-view-image.component';
import { DateTime } from 'luxon';
import { TimeLineService } from './time-line.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'asha-time-line',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslocoModule, DialogViewImageComponent],
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.scss'
})
export class TimeLineComponent implements OnInit {
  @Input() timelineData: any[] = [];
  @Input() defaultTimeline: any[] = [];
  @Input() module: 'packing_list' | 'thai_warehouse' = 'packing_list';

  timeline: any[] = [];

  Id: number;

  constructor(
    private activated: ActivatedRoute,
    private readonly translocoService: TranslocoService,
    public dialog: MatDialog,
    private http: HttpClient,
    private _service: TimeLineService,
  ) {
    this.Id = this.activated.snapshot.params.id;
  }

  ngOnInit(): void {
    for (const timeline of this.defaultTimeline) {
      for (const item of this.timelineData) {
        if (timeline.value === item.status) {
          const date = DateTime.fromISO(item.updated_at).toFormat('yyyy-MM-dd');
          const time = DateTime.fromISO(item.updated_at).toFormat('HH:mm');

          timeline.status = true;
          timeline.date = date;
          timeline.time = time;
          timeline.image = item?.image ?? null;
        }
      }
    }

    this.timeline = this.defaultTimeline;
  }

  opendialogviewimage(item: any) {
    const images = item?.image ? [
      {
        imagePreview: environment.apiUrl + '/' + item?.image,
        name: 'Image 1',
      }
    ] : [];

    const DialogRef = this.dialog.open(DialogViewImageComponent, {
      disableClose: true,
      width: '500px',
      maxHeight: '90vh',
      enterAnimationDuration: 300,
      exitAnimationDuration: 300,
      data: {
        images: images,
        can_add: true,
      },
    });
    DialogRef.afterClosed().subscribe((result: any) => {
      if (result != undefined) {
        
        if (this.module == 'packing_list') {
          const body = {
            status: item.value,
            image: result.data,
            packing_lists: [this.Id],
          }
  
          this._service.updateStatusPackingList(body).subscribe({
            next: (resp: any) => {
              this.ngOnInit();
            },
          });
        } else if (this.module == 'thai_warehouse') {
          const body = {
            status: item.value,
            image: result.data,
            delivery_order_thais: [this.Id],
          }
  
          this._service.updateStatusThaiWarehouse(body).subscribe({
            next: (resp: any) => {
              this.ngOnInit();
            },
          });
        }

      }
    });
  }
}
