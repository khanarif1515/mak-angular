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
    const returnVal = (formattedIntegerPart!=='0' ? '₹' : '') + formattedIntegerPart + (decimalPart !== '00' ? '.' + decimalPart : '')
    return returnVal;
  }

}
