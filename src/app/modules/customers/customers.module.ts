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
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { OwnerComponent } from './components/owner/owner.component';
import { BuildingInfoComponent } from './components/building-info/building-info.component';
import { AddBuildingInfoModalComponent } from './components/building-info/components/add-building-info-modal/add-building-info-modal.component';
import { EditBuildingInfoModalComponent } from './components/building-info/components/edit-building-info-modal/edit-building-info-modal.component';
import { SystemInfoComponent } from './components/system-info/system-info.component';
import { AddSystemInfoComponent } from './components/system-info/components/add-system-info/add-system-info.component';
import { EditSystemInfoComponent } from './components/system-info/components/edit-system-info/edit-system-info.component';
import { SystemInfoTableComponent } from './components/system-info/components/system-info-table/system-info-table.component';
import { AddImageModalComponent } from './components/images/add-image-modal/add-image-modal.component';
import { ImagesComponent } from './components/images/images.component';

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
    CustomerHomeTableComponent,
    CustomerInfoComponent,
    OwnerComponent,
    BuildingInfoComponent,
    AddBuildingInfoModalComponent,
    EditBuildingInfoModalComponent,
    SystemInfoComponent,
    AddSystemInfoComponent,
    EditSystemInfoComponent,
    SystemInfoTableComponent,
    ImagesComponent,
    AddImageModalComponent,
  ],

  imports: [CommonModule, CustomersRoutingModule, SharedModule],
  bootstrap: [CustomersComponent],
})
export class CustomersModule {}
