import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeInventoryComponent } from './components/home-inventory/home-inventory.component';
import { PartsComponent } from './components/parts/parts.component';
import { AddPartsComponent } from './components/parts/components/add-parts/add-parts.component';
import { EditPartsComponent } from './components/parts/components/edit-parts/edit-parts.component';
import { PartsModuleTableComponent } from './components/parts/components/parts-module-table/parts-module-table.component';
import { AssignPartsComponent } from './components/parts/components/assign-parts/assign-parts.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { AddSupplierComponent } from './components/suppliers/components/add-supplier/add-supplier.component';
import { EditSupplierComponent } from './components/suppliers/components/edit-supplier/edit-supplier.component';
import { SupplierModuleTableComponent } from './components/suppliers/components/supplier-module-table/supplier-module-table.component';
import { ToolsComponent } from './components/tools/tools.component';
import { AddToolsComponent } from './components/tools/components/add-tools/add-tools.component';
import { EditToolsComponent } from './components/tools/components/edit-tools/edit-tools.component';
import { ToolsModuleTableComponent } from './components/tools/components/tools-module-table/tools-module-table.component';
import { AssignToolsComponent } from './components/tools/components/assign-tools/assign-tools.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionsModuleTableComponent } from './components/transactions/transactions-module-table/transactions-module-table.component';
import { TransactionDetailsComponent } from './components/transactions/transaction-details/transaction-details.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { VehiclesModuleTableComponent } from './components/vehicles/components/vehicles-module-table/vehicles-module-table.component';
import { AddVehicleComponent } from './components/vehicles/components/add-vehicle/add-vehicle.component';
import { EditVehicleComponent } from './components/vehicles/components/edit-vehicle/edit-vehicle.component';
import { PartsToolsTableComponent } from './components/vehicles/components/parts-tools-table/parts-tools-table.component';
import { AssignPartsModalComponent } from './components/parts/components/assign-parts-modal/assign-parts-modal.component';
import { AssignToolsModalComponent } from './components/tools/components/assign-tools-modal/assign-tools-modal.component';
import { AssignedToolsTableComponent } from './components/tools/components/assigned-tools-table/assigned-tools-table.component';
import { AssignedPartsTableComponent } from './components/parts/components/assigned-parts-table/assigned-parts-table.component';
import { ItemModuleTableComponent } from './components/items/components/item-module-table/item-module-table.component';
import { ItemsComponent } from './components/items/items.component';
import { AddItemComponent } from './components/items/components/add-item/add-item.component';
import { EditItemComponent } from './components/items/components/edit-item/edit-item.component';

@NgModule({
  declarations: [
    InventoryComponent,
    HomeInventoryComponent,
    PartsComponent,
    AddPartsComponent,
    EditPartsComponent,
    PartsModuleTableComponent,
    AssignPartsComponent,
    SuppliersComponent,
    AddSupplierComponent,
    EditSupplierComponent,
    SupplierModuleTableComponent,
    ToolsComponent,
    AddToolsComponent,
    EditToolsComponent,
    ToolsModuleTableComponent,
    AssignToolsComponent,
    TransactionsComponent,
    TransactionsModuleTableComponent,
    TransactionDetailsComponent,
    VehiclesComponent,
    VehiclesModuleTableComponent,
    AddVehicleComponent,
    EditVehicleComponent,
    PartsToolsTableComponent,
    AssignPartsModalComponent,
    AssignToolsModalComponent,
    AssignedToolsTableComponent,
    AssignedPartsTableComponent,
    ItemModuleTableComponent,
    ItemsComponent,
    AddItemComponent,
    EditItemComponent
  ],
  imports: [CommonModule, InventoryRoutingModule, SharedModule],
  bootstrap: [InventoryComponent],
})
export class InventoryModule {}
