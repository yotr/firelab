import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerHomeComponent } from './components/customer-home/customer-home.component';
import { CustomersComponent } from './customers.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { CustomersModuleTableComponent } from './components/customers-module-table/customers-module-table.component';
import { DropFileSectionComponent } from './components/drop-file-section/drop-file-section.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllCustomersComponent } from './components/all-customers/all-customers.component';
import { CustomerHomeTableComponent } from './components/customer-home/components/customer-home-table/customer-home-table.component';
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { OwnerComponent } from './components/owner/owner.component';
import { ImportDevicesComponent } from './components/import-devices/import-devices.component';
import { AddDeviceComponent } from './components/import-devices/components/add-device/add-device.component';
import { ImporDevicesModuleTableComponent } from './components/import-devices/components/impor-devices-module-table/impor-devices-module-table.component';
import { EditDeviceComponent } from './components/import-devices/components/edit-device/edit-device.component';
import { RecurringInspectionsComponent } from './components/recurring-inspections/recurring-inspections.component';
import { RecurringInspectionsModuleTableComponent } from './components/recurring-inspections/components/recurring-inspections-module-table/recurring-inspections-module-table.component';
import { AddRecurringInspectionsComponent } from './components/recurring-inspections/components/add-recurring-inspections/add-recurring-inspections.component';
import { EditRecurringInspectionsComponent } from './components/recurring-inspections/components/edit-recurring-inspections/edit-recurring-inspections.component';
import { CustomersDeficienciesComponent } from './components/customers-Deficiencies/customers-Deficiencies.component';
import { CustomerDeficienciesModuleTableComponent } from './components/customers-Deficiencies/customer-Deficiencies-module-table/customer-Deficiencies-module-table.component';
import { CustomerPortalComponent } from './components/customer-portal/customer-portal.component';
import { AddJobComponent } from './components/add-job/add-job.component';
import { AutoEmailComponent } from './components/auto-email/auto-email.component';
import { HoodSystemComponent } from './components/hood-system/hood-system.component';
import { HoodSystemModuleTableComponent } from './components/hood-system/hood-system-module-table/hood-system-module-table.component';

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
    CustomerHomeTableComponent,
    CustomerInfoComponent,
    OwnerComponent,
    ImportDevicesComponent,
    AddDeviceComponent,
    EditDeviceComponent,
    ImporDevicesModuleTableComponent,
    RecurringInspectionsComponent,
    RecurringInspectionsModuleTableComponent,
    AddRecurringInspectionsComponent,
    EditRecurringInspectionsComponent,
    CustomersDeficienciesComponent,
    CustomerDeficienciesModuleTableComponent,
    CustomerPortalComponent,
    AddJobComponent,
    AutoEmailComponent,
    HoodSystemComponent,
    HoodSystemModuleTableComponent,
    // ImagesComponent,
    // AddImageModalComponent,
    // ViewImageModalComponent,
    // CustomerReportsSidebarComponent,
  ],

  imports: [CommonModule, SharedModule, CustomersRoutingModule],
  bootstrap: [CustomersComponent],
})
export class CustomersModule {}
