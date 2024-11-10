/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditContractComponent } from './edit-contract.component';

describe('EditContractComponent', () => {
  let component: EditContractComponent;
  let fixture: ComponentFixture<EditContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
