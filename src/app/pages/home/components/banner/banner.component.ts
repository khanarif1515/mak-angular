import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { VariablesService } from 'src/app/shared/services';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent {

  @Input() data: any;

  constructor(
    public vars: VariablesService
  ) {}
}
