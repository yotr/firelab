import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any, args: any[]): any {
    let sortingKey = args[0] as string;
    let sortingDirection = args[1];
    let muliplier = 0;
    //change sorting direction id decreasing
    if (sortingDirection === 'desc') {
      muliplier = -1;
    } else if (sortingDirection === 'asc') {
      muliplier = 1;
    } else {
      muliplier = 0;
    }
    // sorting
    if (sortingKey === '') {
      return value;
    }
    value.sort((a: any, b: any) => {
      if (a[sortingKey] < b[sortingKey]) {
        return -1 * muliplier;
      } else if (a[sortingKey] > b[sortingKey]) {
        return 1 * muliplier;
      } else {
        return 0;
      }
    });
    return value;
  }
}
