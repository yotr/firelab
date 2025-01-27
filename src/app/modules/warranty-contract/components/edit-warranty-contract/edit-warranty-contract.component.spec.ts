/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditWarrantyContractComponent } from './edit-warranty-contract.component';

describe('EditWarrantyContractComponent', () => {
  let component: EditWarrantyContractComponent;
  let fixture: ComponentFixture<EditWarrantyContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWarrantyContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWarrantyContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
