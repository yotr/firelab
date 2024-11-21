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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
