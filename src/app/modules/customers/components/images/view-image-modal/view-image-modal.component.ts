import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-image-modal',
  templateUrl: './view-image-modal.component.html',
  styleUrls: ['./view-image-modal.component.css'],
})
export class ViewImageModalComponent implements OnInit {
  @Input() image: string = 'assets/logo.png';

  constructor() {}

  ngOnInit() {}
}
