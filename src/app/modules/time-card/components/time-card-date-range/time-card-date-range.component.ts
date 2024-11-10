import { Component, OnInit } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';

@Component({
  selector: 'app-time-card-date-range',
  templateUrl: './time-card-date-range.component.html',
  styleUrls: ['./time-card-date-range.component.css'],
})
export class TimeCardDateRangeComponent implements OnInit {
  today = new Date();
  title = 'daterangepicker-bootstrap-sdk';
  dropsDown = 'down';
  dropsUp = 'up';
  opensRight = 'right';
  opensCenter = 'center';
  opensLeft = 'left';
  selectedRangeCalendarTimeRight: any;
  selectedRangeCalendarCenter: any;
  selectedRangeCalendarAutoLeft: any;
  selectedSingleCalendarTimeRight: any;
  selectedSingleCalendarCenter: any;
  selectedSingleCalendarAutoLeft: any;
  selectedSimpleCalendarTimeUpRight: any;
  selectedSimpleCalendarUpCenter: any;
  selectedSimpleCalendarAutoUpLeft: any;
  selectedRangeCalendarTimeInline: any;
  maxDate?: dayjs.Dayjs;
  minDate?: dayjs.Dayjs;
  invalidDates: dayjs.Dayjs[] = [];
  ranges: any = {
    Today: [dayjs().startOf('day'), dayjs().endOf('day')],
    Yesterday: [
      dayjs().startOf('day').subtract(1, 'day'),
      dayjs().endOf('day').subtract(1, 'day'),
    ],
    'Last 7 days': [
      dayjs().startOf('day').subtract(6, 'days'),
      dayjs().endOf('day'),
    ],
    'Last 30 days': [
      dayjs().startOf('day').subtract(29, 'days'),
      dayjs().endOf('day'),
    ],
    'This month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last month': [
      dayjs().startOf('month').subtract(1, 'month'),
      dayjs().endOf('month').subtract(1, 'month'),
    ],
  };
  localeTime = {
    firstDay: 1,
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
    format: 'DD.MM.YYYY HH:mm:ss',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
  };
  locale = {
    firstDay: 1,
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
    format: 'DD.MM.YYYY',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
  };
  tooltips = [
    { date: dayjs(), text: 'Today is just unselectable' },
    { date: dayjs().add(2, 'days'), text: 'Yeeeees!!!' },
  ];

  constructor() {
    this.selectedRangeCalendarTimeRight = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day'),
    };
    this.selectedRangeCalendarCenter = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day'),
    };
    this.selectedRangeCalendarAutoLeft = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day'),
    };
    this.selectedSingleCalendarTimeRight = dayjs().startOf('day');
    this.selectedSingleCalendarCenter = dayjs().startOf('day');
    this.selectedSingleCalendarAutoLeft = dayjs().startOf('day');
    this.selectedSimpleCalendarTimeUpRight = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day'),
    };
    this.selectedSimpleCalendarUpCenter = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day'),
    };
    this.selectedSimpleCalendarAutoUpLeft = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day'),
    };
    this.selectedRangeCalendarTimeInline = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day'),
    };
  }
  ngOnInit(): void {}

  isInvalidDate = (m: dayjs.Dayjs) => {
    return this.invalidDates.some((d) => d.isSame(m, 'day'));
  };

  isCustomDate = (date: dayjs.Dayjs) => {
    return date.month() === 0 || date.month() === 6 ? 'mycustomdate' : false;
  };

  isTooltipDate = (m: dayjs.Dayjs) => {
    const tooltip = this.tooltips.find((tt) => tt.date.isSame(m, 'day'));
    return tooltip ? tooltip.text : false;
  };

  datesUpdatedRange($event: Object) {
    console.log('range', $event);
  }

  datesUpdatedSingle($event: any) {
    console.log('single', $event);
  }

  datesUpdatedInline($event: Object) {
    console.log('inline', $event);
  }
}
