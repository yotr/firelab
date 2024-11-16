import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerHomeComponent } from './components/customer-home/customer-home.component';
import { CustomersComponent } from './customers.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { CustomersModuleTableComponent } from './components/customers-module-table/customers-module-table.component';
import { CustomerReportsSidebarComponent } from './components/customer-reports-sidebar/customer-reports-sidebar.component';
import { DropFileSectionComponent } from './components/drop-file-section/drop-file-section.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllCustomersComponent } from './components/all-customers/all-customers.component';
import { CustomerHomeTableComponent } from './components/customer-home/components/customer-home-table/customer-home-table.component';

@NgModule({
  declarations: [
    CustomersComponent,
    AllCustomersComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    CustomerHomeComponent,
    CustomersModuleTableComponent,
    CustomerHomeComponent,
    DropFileSectionComponent,
    CustomerReportsSidebarComponent,
    CustomerHomeTableComponent
  ],
  imports: [CommonModule, CustomersRoutingModule, SharedModule],
  bootstrap: [CustomersComponent],
})
export class CustomersModule {}
