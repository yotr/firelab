import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerHomeComponent } from './components/customer-home/customer-home.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { CustomersComponent } from './customers.component';
import { AllCustomersComponent } from './components/all-customers/all-customers.component';
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { OwnerComponent } from './components/owner/owner.component';
import { BuildingInfoComponent } from './components/building-info/building-info.component';
import { AddBuildingInfoModalComponent } from './components/building-info/components/add-building-info-modal/add-building-info-modal.component';
import { EditBuildingInfoModalComponent } from './components/building-info/components/edit-building-info-modal/edit-building-info-modal.component';
import { SystemInfoComponent } from './components/system-info/system-info.component';
import { AddSystemInfoComponent } from './components/system-info/components/add-system-info/add-system-info.component';
import { EditSystemInfoComponent } from './components/system-info/components/edit-system-info/edit-system-info.component';
import { ImagesComponent } from './components/images/images.component';
import { ImportDevicesComponent } from './components/import-devices/import-devices.component';
import { AddDeviceComponent } from './components/import-devices/components/add-device/add-device.component';
import { EditDeviceComponent } from './components/import-devices/components/edit-device/edit-device.component';
import { RecurringInspectionsComponent } from './components/recurring-inspections/recurring-inspections.component';
import { AddRecurringInspectionsComponent } from './components/recurring-inspections/components/add-recurring-inspections/add-recurring-inspections.component';
import { EditRecurringInspectionsComponent } from './components/recurring-inspections/components/edit-recurring-inspections/edit-recurring-inspections.component';
import { CustomersDeficienciesComponent } from './components/customers-Deficiencies/customers-Deficiencies.component';
import { CustomerPortalComponent } from './components/customer-portal/customer-portal.component';
import { AutoEmailComponent } from './components/auto-email/auto-email.component';
import { AddJobComponent } from './components/add-job/add-job.component';
import { HoodSystemComponent } from './components/hood-system/hood-system.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddImageModalComponent } from './components/images/add-image-modal/add-image-modal.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    children: [
      {
        path: 'allCustomers',
        component: AllCustomersComponent,
      },
      {
        path: 'add',
        component: AddCustomerComponent,
      },
      {
        path: 'edit/:id',
        component: EditCustomerComponent,
      },
      {
        path: 'home',
        component: CustomerHomeComponent,
      },
      {
        path: 'customerInfo',
        component: CustomerInfoComponent,
      },
      {
        path: 'owner',
        component: OwnerComponent,
      },
      {
        path: 'buildingInfo',
        component: BuildingInfoComponent,
      },
      {
        path: 'buildingInfo/add',
        component: AddBuildingInfoModalComponent,
      },
      {
        path: 'buildingInfo/edit/:id',
        component: EditBuildingInfoModalComponent,
      },
      {
        path: 'systemInfo',
        component: SystemInfoComponent,
      },
      {
        path: 'systemInfo/add',
        component: AddSystemInfoComponent,
      },
      {
        path: 'systemInfo/edit/:id',
        component: EditSystemInfoComponent,
      },
      {
        path: 'images',
        component: ImagesComponent,
      },
      {
        path: 'images/add',
        component: AddImageModalComponent,
      },
      {
        path: 'importDevices',
        component: ImportDevicesComponent,
      },
      {
        path: 'importDevices/add',
        component: AddDeviceComponent,
      },
      {
        path: 'importDevices/edit/:id',
        component: EditDeviceComponent,
      },
      {
        path: 'recurringInspections',
        component: RecurringInspectionsComponent,
      },
      {
        path: 'recurringInspections/add',
        component: AddRecurringInspectionsComponent,
      },
      {
        path: 'recurringInspections/edit/:id',
        component: EditRecurringInspectionsComponent,
      },
      {
        path: 'customerDeficiencies',
        component: CustomersDeficienciesComponent,
      },
      {
        path: 'customerPortal',
        component: CustomerPortalComponent,
      },
      {
        path: 'addJob',
        component: AddJobComponent,
      },
      {
        path: 'autoEmail',
        component: AutoEmailComponent,
      },
      {
        path: 'hoodSystem',
        component: HoodSystemComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
