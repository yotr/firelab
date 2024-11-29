import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finish-custom-questions',
  templateUrl: './finish-custom-questions.component.html',
  styleUrls: ['./finish-custom-questions.component.css'],
})
export class FinishCustomQuestionsComponent implements OnInit {
  types: any[] = [];
  recurrences: any[] = [];

  constructor() {
    this.types = [
      {
        title: 'Pass / Fail / N/A',
        value: 'pass_fail',
      },
      {
        title: 'Yes / No',
        value: 'yes_no',
      },
      {
        title: 'Text Input',
        value: 'input',
      },
      {
        title: 'Date Picker',
        value: 'date',
      },
    ];
    this.recurrences = [
      {
        title: 'This one Time',
        value: 'oneTime',
      },
      {
        title: 'Every time for this customer',
        value: 'allTime',
      },
      {
        title: 'Show this question on all alarm reports for all customers',
        value: 'allReports',
      },
    ];
  }

  ngOnInit() {}
}
