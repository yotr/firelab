/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WarrantyContractModuleTableComponent } from './warranty-contract-module-table.component';

describe('WarrantyContractModuleTableComponent', () => {
  let component: WarrantyContractModuleTableComponent;
  let fixture: ComponentFixture<WarrantyContractModuleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantyContractModuleTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyContractModuleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
