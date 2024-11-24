import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeInventoryComponent } from './components/home-inventory/home-inventory.component';

@NgModule({
  declarations: [InventoryComponent, HomeInventoryComponent],
  imports: [CommonModule, InventoryRoutingModule, SharedModule],
  bootstrap: [InventoryComponent],
})
export class InventoryModule {}
