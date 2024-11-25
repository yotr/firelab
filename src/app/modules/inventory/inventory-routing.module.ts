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

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      {
        path: 'home',
        component: HomeInventoryComponent,
      },
      // parts
      {
        path: 'parts',
        component: PartsComponent,
      },
      {
        path: 'parts/add',
        component: AddPartsComponent,
      },
      {
        path: 'parts/edit/:id',
        component: EditPartsComponent,
      },
      {
        path: 'parts/assign',
        component: AssignPartsComponent,
      },
      // suppliers
      {
        path: 'suppliers',
        component: SuppliersComponent,
      },
      {
        path: 'suppliers/add',
        component: AddSupplierComponent,
      },
      {
        path: 'suppliers/edit/:id',
        component: EditSupplierComponent,
      },
      // tools
      {
        path: 'tools',
        component: ToolsComponent,
      },
      {
        path: 'tools/add',
        component: AddToolsComponent,
      },
      {
        path: 'tools/edit/:id',
        component: EditToolsComponent,
      },
      {
        path: 'tools/assign',
        component: AssignToolsComponent,
      },
      // transactions
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'transactionDetails',
        component: TransactionDetailsComponent,
      },
      // vehicles
      {
        path: 'vehicles',
        component: VehiclesComponent,
      },
      {
        path: 'vehicles/add',
        component: AddVehicleComponent,
      },
      {
        path: 'vehicles/edit/:id',
        component: EditVehicleComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
