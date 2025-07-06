import { Component } from '@angular/core';
import { OptimizedImage } from '../../core/optimized-image/optimized-image';
import { FlagPath, GetCountries } from '../../shared/models/countries.model';

@Component({
  selector: 'app-about-us',
  imports: [OptimizedImage],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss'
})
export class AboutUs {

  flagPath = FlagPath;
  countries = GetCountries();
  priorCountries = ['in', 'us', 'ae', 'gb'];

  search(e: any) {
    this.countries = GetCountries(this.priorCountries, { search: e.target.value });
  }

}
