import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
export class CustomMatDataSource<T> extends MatTableDataSource<any[]> {
  constructor(initialData: any[]) {
    super(initialData);
    this.sortingDataAccessor = (item: any, property: string) => {
      console.log({ property })
      if (property.includes('.')) {
        const properties = property.split('.');
        return item[properties[0]][properties[1]];
      }
      return item[property];
    }
  }
}