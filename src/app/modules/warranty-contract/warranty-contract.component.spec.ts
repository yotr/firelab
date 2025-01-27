/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WarrantyContractComponent } from './warranty-contract.component';

describe('WarrantyContractComponent', () => {
  let component: WarrantyContractComponent;
  let fixture: ComponentFixture<WarrantyContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantyContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
