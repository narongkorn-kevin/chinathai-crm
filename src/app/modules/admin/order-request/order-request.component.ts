    // order-request.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-order-request',
  templateUrl: './order-request.component.html',
  styleUrls: ['./order-request.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
  ]
})
export class OrderRequestComponent implements OnInit {
  form: FormGroup;
 formFieldHelpers: string[] = ['fuse-mat-dense'];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      customer: [null, Validators.required],
      items: this.fb.array([this.createItem()]),
      transportType: ['air'],
      deliveryNote: [''],
      note: '',
      provider: '',
      option: '',
      code: '',
      status: '',
      type: '',
      quantity: '',
      name: '',
      inThailand: this.fb.group({
        option: ['wait'],
        provider: ['PL EXPRESS']
      })
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      code: [''],
      name: [''],
      quantity: [''],
      type: ['ทั่วไป'],
      note: [''],
      status: ['ไม่เสร็จ']
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }
}
