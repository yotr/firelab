import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-parts-modal',
  templateUrl: './assign-parts-modal.component.html',
  styleUrls: ['./assign-parts-modal.component.css'],
})
export class AssignPartsModalComponent implements OnInit {
  suppliers: any[] = [];
  reports: any[] = [];
  parts: any[] = [];

  constructor() {
    this.suppliers = [
      {
        id: 0,
        value: 'Supplier One',
      },
      {
        id: 1,
        value: 'Supplier two',
      },
      {
        id: 2,
        value: 'Supplier Three',
      },
    ];
    this.reports = [
      {
        id: 0,
        value: 'Alarm',
      },
      {
        id: 1,
        value: 'Fire Door',
      },
    ];
    this.parts = [
      {
        id: 0,
        value: 'Part One',
      },
      {
        id: 1,
        value: 'Part Two',
      },
    ];
  }

  ngOnInit() {}
}
