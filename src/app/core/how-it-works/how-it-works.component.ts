import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxGlideModule } from 'ngx-glide';
import { VariablesService } from 'src/app/shared/services';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, NgxGlideModule, NgOptimizedImage],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss'
})
export class HowItWorksComponent {
  @Input() data: any;

  constructor(
    public vars: VariablesService
  ) { }

}
