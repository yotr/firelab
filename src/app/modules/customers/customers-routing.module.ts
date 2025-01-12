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
import { pageGuard } from 'src/app/guards/page.guard';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    children: [
      {
        path: 'allCustomers',
        component: AllCustomersComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P1', action: 'read' },
      },
      {
        path: 'add',
        component: AddCustomerComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P1', action: 'create' },
      },
      {
        path: 'edit/:id',
        component: EditCustomerComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P1', action: 'update' },
      },
      {
        path: 'home',
        component: CustomerHomeComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P2', action: 'read' },
      },
      {
        path: 'customerInfo',
        component: CustomerInfoComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P3', action: 'read' },
      },
      {
        path: 'owner',
        component: OwnerComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P4', action: 'read' },
      },
      {
        path: 'buildingInfo',
        component: BuildingInfoComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P5', action: 'read' },
      },
      {
        path: 'buildingInfo/add',
        component: AddBuildingInfoModalComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P5', action: 'create' },
      },
      {
        path: 'buildingInfo/edit/:id',
        component: EditBuildingInfoModalComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P5', action: 'update' },
      },
      {
        path: 'systemInfo',
        component: SystemInfoComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P6', action: 'read' },
      },
      {
        path: 'systemInfo/add',
        component: AddSystemInfoComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P6', action: 'create' },
      },
      {
        path: 'systemInfo/edit/:id',
        component: EditSystemInfoComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P6', action: 'update' },
      },
      {
        path: 'images',
        component: ImagesComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P7', action: 'read' },
      },
      {
        path: 'images/add',
        component: AddImageModalComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P7', action: 'create' },
      },
      {
        path: 'importDevices',
        component: ImportDevicesComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P8', action: 'read' },
      },
      {
        path: 'importDevices/add',
        component: AddDeviceComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P8', action: 'create' },
      },
      {
        path: 'importDevices/edit/:id',
        component: EditDeviceComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P8', action: 'update' },
      },
      {
        path: 'recurringInspections',
        component: RecurringInspectionsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P9', action: 'read' },
      },
      {
        path: 'recurringInspections/add',
        component: AddRecurringInspectionsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P9', action: 'create' },
      },
      {
        path: 'recurringInspections/edit/:id',
        component: EditRecurringInspectionsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P9', action: 'update' },
      },
      {
        path: 'customerDeficiencies',
        component: CustomersDeficienciesComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P10', action: 'read' },
      },
      {
        path: 'customerPortal',
        component: CustomerPortalComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P11', action: 'read' },
      },
      {
        path: 'addJob',
        component: AddJobComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P12', action: 'read' },
      },
      {
        path: 'autoEmail',
        component: AutoEmailComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM2P13', action: 'read' },
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
