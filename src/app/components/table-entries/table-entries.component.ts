import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-entries',
  templateUrl: './table-entries.component.html',
  styleUrls: ['./table-entries.component.css'],
})
export class TableEntriesComponent implements OnInit {
  @Input() entries: any[] =[];
  @Input() dataLength: number = 0;
  @Output() onSizeChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onTableSizeChange(event: any) {
    this.onSizeChange.emit(event);
  }
}
