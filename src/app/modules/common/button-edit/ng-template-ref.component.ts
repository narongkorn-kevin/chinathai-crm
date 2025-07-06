import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { IDemoNgComponentEventType } from './ng-template-ref-event-type';

@Component({
  selector: 'app-ng-template-ref',
  templateUrl: './ng-template-ref.component.html',
})
export class DemoNgComponent implements OnInit {

  constructor() { }

  @Output()
  emitter = new Subject<IDemoNgComponentEventType>();

  @Input()
  data = {};

  @Input()
  actionText = 'Action 1';

  ngOnInit(): void {
  }

  onAction1() {
    this.emitter.next({
      cmd: 'action1',
      data: this.data
    });
  }

  ngOnDestroy() {
    this.emitter.unsubscribe();
  }

}