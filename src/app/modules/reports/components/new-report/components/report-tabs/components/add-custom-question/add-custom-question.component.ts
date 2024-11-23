import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-custom-question',
  templateUrl: './add-custom-question.component.html',
  styleUrls: ['./add-custom-question.component.css'],
})
export class AddCustomQuestionComponent implements OnInit {
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
