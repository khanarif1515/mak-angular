import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrFormat',
  standalone: true
})
export class InrFormatPipe implements PipeTransform {

  transform(value: number | string): string {
    // Ensure the value is a number
    if (typeof value !== 'number') {
      return value;
    }

    // Split the integer and decimal parts
    const [integerPart, decimalPart] = value.toFixed(2).split('.');

    // Format the integer part with proper comma placement for INR format
    let formattedIntegerPart = integerPart;
    if (integerPart.length > 3) {
      formattedIntegerPart = integerPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + integerPart.slice(-3);
    }

    // Combine the formatted integer part with the decimal part
    const returnVal = formattedIntegerPart + (decimalPart !== '00' ? '.' + decimalPart : '')
    return returnVal;
  }


  // transform(value: number | string, currency: string = ''): string {
  //   const number = typeof value === 'string' ? parseFloat(value) : value;
  //   let locale: string = 'en-US';
  //   let skipDecimal = true;
  //   if (currency === 'INR') {
  //     locale = 'en-IN';
  //   }
  //   const decimalSupportCurrencies = ['USD'];
  //   if (decimalSupportCurrencies.includes(currency)) {
  //     skipDecimal = false;
  //   }

  //   if (isNaN(number)) {
  //     return value?.toString();  // Return original value if it's not a number
  //   }

  //   // Format the number according to the locale and attach the currency symbol (if provided)
  //   let formattedNumber = new Intl.NumberFormat(locale, {
  //     style: 'currency',
  //     currency: currency,
  //     currencyDisplay: 'symbol',
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2
  //   }).format(number);

  //   // Remove currency symbol if no currency provided
  //   if (!currency) {
  //     formattedNumber = formattedNumber.replace(/[^\d,.-]/g, '');
  //   }

  //   if (formattedNumber.match('.') && (+formattedNumber.split('.')[1] === 0 || skipDecimal)) {
  //     formattedNumber = formattedNumber.split('.')[0];
  //   }

  //   return formattedNumber;
  // }


}
