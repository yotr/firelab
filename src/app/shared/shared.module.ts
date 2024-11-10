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

export function httpTranslateLoaderfactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    FilterPipe,
    SortPipe,
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
  ],
  providers: [HttpClient],
})
export class SharedModule {}
