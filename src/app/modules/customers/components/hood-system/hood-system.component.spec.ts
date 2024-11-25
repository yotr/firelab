/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HoodSystemComponent } from './hood-system.component';

describe('HoodSystemComponent', () => {
  let component: HoodSystemComponent;
  let fixture: ComponentFixture<HoodSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoodSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoodSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
