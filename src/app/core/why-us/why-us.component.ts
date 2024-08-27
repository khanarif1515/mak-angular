import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomainNamePipe } from 'src/app/shared/pipes/domain-name/domain-name.pipe';
import { VariablesService } from 'src/app/shared/services';

@Component({
  selector: 'app-why-us',
  standalone: true,
  imports: [DomainNamePipe, NgOptimizedImage],
  templateUrl: './why-us.component.html',
  styleUrl: './why-us.component.scss'
})
export class WhyUsComponent {
  @Input() data: any;

  constructor(
    public vars: VariablesService
  ) { }
}
