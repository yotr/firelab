import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
declare const $: any;

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css'],
})
export class ReportDetailsComponent implements OnInit {
  // frequency
  frequencies: any[] = [];
  frequencyLoading: boolean = true;
  activeSection: string = 'tabs';
  reportId: any = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    //get queries
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('section')) {
        this.activeSection = paramMap['get']('section');
      }
    });
    //get id
    this.activatedRoute.paramMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('id')) {
        this.reportId = paramMap['get']('id');
      }
    });

    this.frequencies = [
      'Weekly',
      'Bi Weekly',
      'Monthly',
      'Bi Monthly',
      'Quarterly',
      'Semi Annual',
      'Annual',
    ];
  }

  ngOnInit() {
    // this.startReport();
  }

  startReport() {
    $('#start_report_modal').modal('show');
  }
  setActiveSection(section: string) {
    this.router.navigate(['/modules/reports/reportDetail',this.reportId], {
      queryParams: { section: section },
    });
  }
}
