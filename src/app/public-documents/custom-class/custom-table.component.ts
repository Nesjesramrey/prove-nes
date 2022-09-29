import { MatTableDataSource } from '@angular/material/table';
export class CustomMatDataSource extends MatTableDataSource<any> {
  override sortingDataAccessor = (item: any, property: string) => {
    console.log(property)
    if (property.includes('.')) {
      const properties = property.split('.');
      return item[properties[0]][properties[1]];
    }
    return item[property];
  };
}
