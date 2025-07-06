import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-ng',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-ng.component.html',
  styleUrl: './button-ng.component.scss'
})
export class ButtonNgComponent implements OnInit {

  ngOnInit(): void { }
}
