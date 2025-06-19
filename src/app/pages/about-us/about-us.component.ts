import { Component } from '@angular/core';
import { FlagPath, GetCountries } from '../../shared/models/countries.model';
import { OptimizedImageComponent } from "../../core/optimized-image/optimized-image.component";

@Component({
  selector: 'app-about-us',
  imports: [OptimizedImageComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

  flagPath = FlagPath;
  countries = GetCountries();
  priorCountries = ['in', 'us', 'ae', 'gb'];

  search(e: any) {
    this.countries = GetCountries(this.priorCountries, { search: e.target.value });
  }
}
