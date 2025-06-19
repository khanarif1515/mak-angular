import { Directive, ElementRef, inject, Input } from '@angular/core';
import { Currencies } from '../../models/currencies';

@Directive({
  selector: '[appCurrency]'
})
export class CurrencyDirective {
  readonly el = inject(ElementRef<HTMLElement>);

  @Input() currency: string = '';

  ngOnChanges() {
    const symbol = Currencies.find((item) => item.currency === this.currency?.toUpperCase())?.symbol;
    this.el.nativeElement.innerHTML = symbol || this.currency;
  }
}
