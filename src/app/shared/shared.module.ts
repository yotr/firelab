import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FilterPipe } from '../pipes/filter.pipe';
import { GridTableComponent } from '../layouts/grid-table/grid-table.component';
import { SortPipe } from '../pipes/sort.pipe';
import { SkeletonComponent } from '../components/skeleton/skeleton.component';
import { TableSearchComponent } from '../components/table-search/table-search.component';
import { DeleteModalComponent } from '../components/delete-modal/delete-modal.component';
import { ExportExcelComponent } from '../components/export-excel/export-excel.component';
import { ImportExcelComponent } from '../components/import-excel/import-excel.component';
import { DownloadPdfComponent } from '../components/download-pdf/download-pdf.component';
import { TableDropdownComponent } from '../components/table-dropdown/table-dropdown.component';
import { TableEntriesComponent } from '../components/table-entries/table-entries.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { BackButtonComponent } from '../components/back-button/back-button.component';
import { LoadingSectionComponent } from '../components/loading-section/loading-section.component';
import { CustomDropdownComponent } from '../components/custom-dropdown/custom-dropdown.component';
import { ClickOutsideDirective } from '../directives/clickOutside.directive';
import { CustomMultiSelectDropdownComponent } from '../components/custom-multi-select-dropdown/custom-multi-select-dropdown.component';
import { ImagesComponent } from '../modules/customers/components/images/images.component';
import { AddImageModalComponent } from '../modules/customers/components/images/add-image-modal/add-image-modal.component';
import { ViewImageModalComponent } from '../modules/customers/components/images/view-image-modal/view-image-modal.component';
import { CustomerReportsSidebarComponent } from '../modules/customers/components/customer-reports-sidebar/customer-reports-sidebar.component';
import { BuildingInfoComponent } from '../modules/customers/components/building-info/building-info.component';
import { AddBuildingInfoModalComponent } from '../modules/customers/components/building-info/components/add-building-info-modal/add-building-info-modal.component';
import { EditBuildingInfoModalComponent } from '../modules/customers/components/building-info/components/edit-building-info-modal/edit-building-info-modal.component';
import { SystemInfoTableComponent } from '../modules/customers/components/system-info/components/system-info-table/system-info-table.component';
import { SystemInfoComponent } from '../modules/customers/components/system-info/system-info.component';
import { AddSystemInfoComponent } from '../modules/customers/components/system-info/components/add-system-info/add-system-info.component';
import { EditSystemInfoComponent } from '../modules/customers/components/system-info/components/edit-system-info/edit-system-info.component';
import { CustomFilterDropdownComponent } from '../components/custom-filter-dropdown/custom-filter-dropdown.component';

export function httpTranslateLoaderfactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    FilterPipe,
    SortPipe,
    ClickOutsideDirective,
    GridTableComponent,
    SkeletonComponent,
    DeleteModalComponent,
    TableSearchComponent,
    ExportExcelComponent,
    ImportExcelComponent,
    DownloadPdfComponent,
    TableDropdownComponent,
    TableEntriesComponent,
    BreadcrumbComponent,
    BackButtonComponent,
    LoadingSectionComponent,
    CustomDropdownComponent,
    CustomMultiSelectDropdownComponent,
    // multi used in other components as well
    ImagesComponent,
    AddImageModalComponent,
    ViewImageModalComponent,
    CustomerReportsSidebarComponent,
    BuildingInfoComponent,
    AddBuildingInfoModalComponent,
    EditBuildingInfoModalComponent,
    SystemInfoComponent,
    SystemInfoTableComponent,
    AddSystemInfoComponent,
    EditSystemInfoComponent,
    CustomFilterDropdownComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    // translation configuration
    TranslateModule.forChild({
      extend: true,
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderfactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    TranslateModule,
    FilterPipe,
    SortPipe,
    ClickOutsideDirective,
    GridTableComponent,
    SkeletonComponent,
    DeleteModalComponent,
    TableSearchComponent,
    ExportExcelComponent,
    ImportExcelComponent,
    DownloadPdfComponent,
    TableDropdownComponent,
    TableEntriesComponent,
    BreadcrumbComponent,
    BackButtonComponent,
    LoadingSectionComponent,
    CustomDropdownComponent,
    CustomMultiSelectDropdownComponent,
    // multi used in other components as well
    ImagesComponent,
    AddImageModalComponent,
    ViewImageModalComponent,
    CustomerReportsSidebarComponent,
    BuildingInfoComponent,
    AddBuildingInfoModalComponent,
    EditBuildingInfoModalComponent,
    SystemInfoComponent,
    SystemInfoTableComponent,
    AddSystemInfoComponent,
    EditSystemInfoComponent,
    CustomFilterDropdownComponent,
  ],
  providers: [HttpClient],
})
export class SharedModule {}
