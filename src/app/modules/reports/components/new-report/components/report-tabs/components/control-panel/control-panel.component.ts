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
      id: this.uuidv4(),
      name: `control panel ${this.panels.length + 1}`,
      type: 1,
      active: true,
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

  removePanel(id: any) {
    this.panels = this.panels.filter((panel) => panel?.id != id);
  }

  formatDate(date: string): any {
    const d: Date = new Date(date);
    return d?.toISOString();
  }
  togglePanel(id: any): void {
    this.panels = this.panels.map((panel, index) => {
      if (panel?.id == id) {
        return panel?.active
          ? { ...panel, active: false }
          : { ...panel, active: true };
      }
      return panel;
    });
  }

  // getnerate random uuid
  uuidv4() {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
}
