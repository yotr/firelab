/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JobLinkComponent } from './job-link.component';

describe('JobLinkComponent', () => {
  let component: JobLinkComponent;
  let fixture: ComponentFixture<JobLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
