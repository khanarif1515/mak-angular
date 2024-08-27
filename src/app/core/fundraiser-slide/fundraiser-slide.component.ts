import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fundraiser-slide',
  standalone: true,
  imports: [],
  templateUrl: './fundraiser-slide.component.html',
  styleUrl: './fundraiser-slide.component.scss'
})
export class FundraiserSlideComponent {
  @Input() fundraisers?: any[];
  @Input() title: any;
  @Input() desc: any;
  @Input() eventInfo: any;
  @Input() showProtect: any;
}
