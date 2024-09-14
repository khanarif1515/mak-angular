import { Pipe, PipeTransform } from '@angular/core';
import { Currency } from '../../model/currency-list';

@Pipe({
  name: 'currencyIcon',
  standalone: true
})
export class CurrencyIconPipe implements PipeTransform {

  currencies = Currency;

  transform(currency: string|undefined, ...args: (string | number)[]): string {
    const symbol = this.currencies.find((item) => item.currency === currency?.toUpperCase())?.symbol;
    return symbol || '';
  }

}
