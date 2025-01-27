/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddWarrantyContractComponent } from './add-warranty-contract.component';

describe('AddWarrantyContractComponent', () => {
  let component: AddWarrantyContractComponent;
  let fixture: ComponentFixture<AddWarrantyContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWarrantyContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWarrantyContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
