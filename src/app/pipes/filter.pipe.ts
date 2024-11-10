import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(data: any[], search?: any): any {
    //check the data
    if (!data) return null;
    if (!search) return data;
    // search by arg as lowercase text
    search = search.toLowerCase();
    //filter args
    return data.filter((item: any) =>
      JSON.stringify(item).toLowerCase().includes(search)
    );
  }
}
