import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'integerFormat'
})
export class IntegerFormatPipe implements PipeTransform {

  transform(value: number | string): string {
    if (typeof value !== 'number') return value;
    const [integer, decimal] = value.toFixed(2).split('.');
    const formattedInteger = integer.length > 3 ? integer.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + integer.slice(-3) : integer;
    return decimal === '00' ? formattedInteger : `${formattedInteger}.${decimal}`;
  }

}
