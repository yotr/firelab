import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css'],
})
export class SkeletonComponent implements OnInit {
  @Input() type: string = 'line';
  @Input() count: number = 0;
  @Input() width: string = '';
  @Input() height: string = '';
  counts: any[] =[];

  constructor() {}

  ngOnInit() {
    this.counts = new Array(this.count).fill(this.count);
  }
}
