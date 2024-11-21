/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecurringInspectionsModuleTableComponent } from './recurring-inspections-module-table.component';

describe('RecurringInspectionsModuleTableComponent', () => {
  let component: RecurringInspectionsModuleTableComponent;
  let fixture: ComponentFixture<RecurringInspectionsModuleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringInspectionsModuleTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringInspectionsModuleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
