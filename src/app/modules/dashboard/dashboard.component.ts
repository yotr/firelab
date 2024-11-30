import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  months: any[] = [];
  years: any[] = [];
  currentMonth: string = '';

  constructor() {
    this.months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  }

  ngOnInit() {
    this.getYears();
    this.getCurrentMonthName();
  }
  getYears() {
    const currentYear = new Date().getFullYear(); // Get the current year
    const years = [];

    // Add the past 10 years and the current year
    for (let i = currentYear - 10; i <= currentYear; i++) {
      years.push(i.toString());
    }

    // Add the next 10 years
    for (let i = currentYear + 1; i <= currentYear + 10; i++) {
      years.push(i.toString());
    }

    this.years = years;
  }

  getCurrentMonthName() {
    const monthNames = this.months;

    const current = new Date().getMonth(); // getMonth() returns a 0-indexed month
    this.currentMonth = monthNames[current];
  }
}
