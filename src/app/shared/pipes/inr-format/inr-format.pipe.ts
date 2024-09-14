import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrFormat',
  standalone: true
})
export class InrFormatPipe implements PipeTransform {

  transform(value: number | string, currency: string = ''): string {
    const number = typeof value === 'string' ? parseFloat(value) : value;
    let locale: string = 'en-US';
    let skipDecimal = true;
    if (currency === 'INR') {
      locale = 'en-IN';
    }
    const decimalSupportCurrencies = ['USD'];
    if (decimalSupportCurrencies.includes(currency)) {
      skipDecimal = false;
    }

    if (isNaN(number)) {
      return value?.toString();  // Return original value if it's not a number
    }

    // Format the number according to the locale and attach the currency symbol (if provided)
    let formattedNumber = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);

    // Remove currency symbol if no currency provided
    if (!currency) {
      formattedNumber = formattedNumber.replace(/[^\d,.-]/g, '');
    }

    if (formattedNumber.match('.') && (+formattedNumber.split('.')[1] === 0 || skipDecimal)) {
      formattedNumber = formattedNumber.split('.')[0];
    }

    return formattedNumber;
  }


}
