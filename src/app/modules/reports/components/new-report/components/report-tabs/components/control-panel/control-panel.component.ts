import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css'],
})
export class ControlPanelComponent implements OnInit {
  panels: any[] = [
    {
      id: 0,
      name: 'control panel 1',
      type: 0,
      active: false,
      questions: [
        {
          question: 'What is a report?',
          type: 'input',
          answer:
            'A report is a structured document that presents information on a particular topic or issue.',
        },
      ],
    },
    {
      id: 1,
      name: 'control panel 2',
      type: 1,
      active: false,
      questions: [
        {
          question: 'What is a report?',
          type: 'input',
          answer:
            'A report is a structured document that presents information on a particular topic or issue.',
        },
      ],
    },
  ];

  types: any[] = [];

  constructor() {
    this.types = [
      {
        id: 0,
        name: 'master panel',
      },
      {
        id: 1,
        name: 'sub panel',
      },
      {
        id: 2,
        name: 'power supply',
      },
    ];
  }

  ngOnInit() {}

  addPanel() {
    let panel = {
      id: 1,
      name: 'control panel',
      type: 1,
      active: false,
      questions: [
        {
          question: 'What is a report?',
          type: 'input',
          answer:
            'A report is a structured document that presents information on a particular topic or issue.',
        },
      ],
    };
    this.panels.push(panel);
  }

  formatDate(date: string): any {
    const d: Date = new Date(date);
    return d?.toISOString();
  }
}
