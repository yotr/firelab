import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.component.html',
  styleUrls: ['./notes-tab.component.css'],
})
export class NotesTabComponent implements OnInit {
  @Input() reportId: any = null;
  deleteId: any = null;
  editId: any = null;
  currentTheme: any;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.getCurrentTheme().subscribe((theme: any) => {
      this.currentTheme = JSON.parse(theme);
    });
  }
  deleteItem() {}
  updateItem(id: any) {
    // this.editId = id;
    // this.updatedData = {
    //   title: 'test',
    //   description: 'testing',
    // };
    // $('#edit_building_info_modal').modal('show');
  }
}
