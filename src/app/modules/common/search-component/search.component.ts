import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BranchService } from 'app/modules/admin/branch/page.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule,ReactiveFormsModule,FormsModule,MatIconModule, MatButtonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit{
  receiveDataFromParent(dataToSend: { startDate: string; endDate: string; }) {
      throw new Error('Method not implemented.');
  }
  
  @Input() items: any;
  @Input() dataArray: any[] = [];
  @Output() dataArrayChange = new EventEmitter<any[]>();
  @Output() dataSearch = new EventEmitter<any>();
  @Output() appSearchClicked = new EventEmitter<void>();

  form: FormGroup
  orderStatus: any[] = [
    { key: "select_payment", value: "เลือกช่องทางชำระ" },
    { key: "wait_payment", value: "รอชำระ" },
    { key: "complete", value: "สำเร็จ" },
    { key: "incomplete", value: "ไม่สำเร็จ" },
    { key: "void ", value: "ยกเลิก" },
  ];
  branch: any[]=[];
  constructor(
    private fb: FormBuilder,
    private _service: BranchService
    
  ) 
  {
    this.form = this.fb.group({
      startDate: '',
      endDate: '',
      status: '',
      branchId: ''
    })

    this._service.getBranch().subscribe((resp: any)=>{
      this.branch = resp;
    })
    
  }

  ngOnInit(): void {
   
  }

  tranferData() {
    this.dataSearch.emit(this.form.value);
  }

  reset() {
    this.form.reset()
  }

}
