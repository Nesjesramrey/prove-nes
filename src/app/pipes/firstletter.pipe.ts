import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstletter'
})
export class FirstLetterPipe implements PipeTransform {
  transform(value: string): string {
    if (value == null) {
      return value;
    }
    const letters = value.charAt(0);
    return letters;
  }
}
