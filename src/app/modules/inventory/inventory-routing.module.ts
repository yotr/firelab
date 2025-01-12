import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { HomeInventoryComponent } from './components/home-inventory/home-inventory.component';
import { PartsComponent } from './components/parts/parts.component';
import { AssignPartsComponent } from './components/parts/components/assign-parts/assign-parts.component';
import { EditPartsComponent } from './components/parts/components/edit-parts/edit-parts.component';
import { AddPartsComponent } from './components/parts/components/add-parts/add-parts.component';
import { EditSupplierComponent } from './components/suppliers/components/edit-supplier/edit-supplier.component';
import { AddSupplierComponent } from './components/suppliers/components/add-supplier/add-supplier.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { ToolsComponent } from './components/tools/tools.component';
import { AddToolsComponent } from './components/tools/components/add-tools/add-tools.component';
import { EditToolsComponent } from './components/tools/components/edit-tools/edit-tools.component';
import { AssignToolsComponent } from './components/tools/components/assign-tools/assign-tools.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionDetailsComponent } from './components/transactions/transaction-details/transaction-details.component';
import { AddVehicleComponent } from './components/vehicles/components/add-vehicle/add-vehicle.component';
import { EditVehicleComponent } from './components/vehicles/components/edit-vehicle/edit-vehicle.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { pageGuard } from 'src/app/guards/page.guard';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      {
        path: 'home',
        component: HomeInventoryComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P1', action: 'read' },
      },
      // parts
      {
        path: 'parts',
        component: PartsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P2', action: 'read' },
      },
      {
        path: 'parts/add',
        component: AddPartsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P2', action: 'create' },
      },
      {
        path: 'parts/edit/:id',
        component: EditPartsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P2', action: 'update' },
      },
      {
        path: 'parts/assign',
        component: AssignPartsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P2', action: 'create' },
      },
      // suppliers
      {
        path: 'suppliers',
        component: SuppliersComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P3', action: 'read' },
      },
      {
        path: 'suppliers/add',
        component: AddSupplierComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P3', action: 'create' },
      },
      {
        path: 'suppliers/edit/:id',
        component: EditSupplierComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P3', action: 'update' },
      },
      // tools
      {
        path: 'tools',
        component: ToolsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P4', action: 'read' },
      },
      {
        path: 'tools/add',
        component: AddToolsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P4', action: 'create' },
      },
      {
        path: 'tools/edit/:id',
        component: EditToolsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P4', action: 'update' },
      },
      {
        path: 'tools/assign',
        component: AssignToolsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P4', action: 'create' },
      },
      // transactions
      {
        path: 'transactions',
        component: TransactionsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P5', action: 'read' },
      },
      {
        path: 'transactionDetails',
        component: TransactionDetailsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P5', action: 'read' },
      },
      // vehicles
      {
        path: 'vehicles',
        component: VehiclesComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P6', action: 'read' },
      },
      {
        path: 'vehicles/add',
        component: AddVehicleComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P6', action: 'create' },
      },
      {
        path: 'vehicles/edit/:id',
        component: EditVehicleComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM9P6', action: 'update' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
