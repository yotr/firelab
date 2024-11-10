import { Component, Input, OnInit } from '@angular/core';

import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-sidebar-link',
  templateUrl: './sidebar-link.component.html',
  styleUrls: ['./sidebar-link.component.css'],
})
export class SidebarLinkComponent implements OnInit {
  @Input() page: string = '';
  @Input() path: string = '';
  @Input() query: any;
  @Input() icon: string = '';

  //variables
  isSidebarClosed: boolean = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    // get sidebar status (is closed or opened)
    this.sidebarService.getSidebarStatus().subscribe((sidebarService) => {
      this.isSidebarClosed = sidebarService;
    });
  }
}
