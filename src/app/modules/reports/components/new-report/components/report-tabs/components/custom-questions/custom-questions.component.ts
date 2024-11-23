import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-questions',
  templateUrl: './custom-questions.component.html',
  styleUrls: ['./custom-questions.component.css'],
})
export class CustomQuestionsComponent implements OnInit {
  questions: any[] = [];

  constructor() {}

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions() {
    this.questions = [
      {
        question: 'What is a report?',
        type: 'input',
        answer:
          'A report is a structured document that presents information on a particular topic or issue.',
      },
      {
        question: 'Was the project completed on time?',
        type: 'pass_fail',
        answer: 'pass',
      },
      {
        question: 'Was the budget for the event exceeded?',
        type: 'yes_no',
        answer: 'no',
      },
      {
        question: 'What is the deadline for the project submission?',
        type: 'date',
        answer: '2015-03-25',
      },
    ];
  }

  formatDate(date: string): any {
    const d: Date = new Date(date);
    return d?.toISOString();
  }
}
