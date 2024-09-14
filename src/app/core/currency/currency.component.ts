import { Component, Input } from '@angular/core';
import { CurrencyIconPipe } from 'src/app/shared/pipes/currency-icon/currency-icon.pipe';

@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [CurrencyIconPipe],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss'
})
export class CurrencyComponent {
  @Input() currency?: string = '';
}
