import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenNum',
  standalone: true
})
export class ShortenNumPipe implements PipeTransform {

  transform(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else if (value >= 100) {
      return value.toFixed(1).replace(/\.0$/, '');
    } else {
      return value.toFixed(1).replace(/\.0$/, '');
    }
  }

}
