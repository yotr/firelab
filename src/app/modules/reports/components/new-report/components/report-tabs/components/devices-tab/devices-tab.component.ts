import { Component, Input, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';

@Component({
  selector: 'app-devices-tab',
  templateUrl: './devices-tab.component.html',
  styleUrls: ['./devices-tab.component.css'],
})
export class DevicesTabComponent implements OnInit {
  @Input() reportId: any = null;
  constructor(private router: Router) {}

  ngOnInit() {}

  addDevices() {
    this.router.navigate(['/modules/reports/addReportDevice', this.reportId]);
  }
}
