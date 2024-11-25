import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-tools-modal',
  templateUrl: './assign-tools-modal.component.html',
  styleUrls: ['./assign-tools-modal.component.css'],
})
export class AssignToolsModalComponent implements OnInit {
  tools: any[] = [];

  constructor() {
    
    this.tools = [
      {
        id: 0,
        value: 'Tool One',
      },
      {
        id: 1,
        value: 'Tool two',
      },
      {
        id: 2,
        value: 'Tool Three',
      },
    ];
  }

  ngOnInit() {}
}
