import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tax-benefit-banner',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './tax-benefit-banner.component.html',
  styleUrl: './tax-benefit-banner.component.scss'
})
export class TaxBenefitBannerComponent {
  @Input() data: any;

}
