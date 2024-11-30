/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CancelReportComponent } from './cancel-report.component';

describe('CancelReportComponent', () => {
  let component: CancelReportComponent;
  let fixture: ComponentFixture<CancelReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
