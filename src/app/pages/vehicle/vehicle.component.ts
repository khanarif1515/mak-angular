import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IntegerFormatPipe } from '../../shared/pipes/integer-format/integer-format.pipe';
import { TypeofPipe } from '../../shared/pipes/typeof/typeof.pipe';
import { ApiService, SeoService } from '../../shared/services';
import { ActivatedRoute } from '@angular/router';
import { ApiEndPoints } from '../../shared/models/api-endpoints.model';
import { NgTemplateOutlet } from '@angular/common';
import { CurrencyDirective } from '../../shared/directives/currency/currency.directive';

@Component({
  selector: 'app-vehicle',
  imports: [NgTemplateOutlet, IntegerFormatPipe, TypeofPipe, CurrencyDirective, FormsModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {

  private readonly actRoute = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  currency = 'INR';
  brand = '';
  customTag = '';
  amazeCost: any;
  emiData: any[] = [];
  filterMonths = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  filterYears = [''];
  filterOthers = [{ id: 0, val: '' }, { id: 1, val: 'only paid months' }, { id: 2, val: 'only unpaid months' }];
  selectedMonth = '';
  selectedYear = '';
  otherSelectedFilter = 0;
  filteredEmiData: any[] = [];
  isDataLoading = true;

  ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.brand = params['brand'];
      this.customTag = params['model'];
      setTimeout(() => {
        this.getDetails();
      }, 0);
    });
  }

  getDetails() {
    this.seo.setPageTitle(`Honda Amaze - MH-12-PQ-4787`);
    const endpoint = ApiEndPoints.getVehicle(this.brand, this.customTag);
    this.api.request('get', endpoint).subscribe({
      next: (res: any) => {
        this.amazeCost = res?.amazeCost;
        this.emiData = res?.emiData || [];
        this.emiData.forEach(item => {
          if (typeof item?.title === 'string') {
            const filterOpts = item.title.split(' ');
            if (!this.filterYears.includes(filterOpts?.[1])) {
              this.filterYears.push(filterOpts?.[1]);
            }
          }
        });
        this.emiData = this.emiData.reverse();
        this.filteredEmiData = this.emiData;
        this.isDataLoading = false;
      },
      error: (err: any) => {
        this.isDataLoading = false;
        console.log(err);
      }
    });
  }

  filterData() {
    this.filteredEmiData = this.emiData;
    if (this.selectedMonth || this.selectedYear) {
      this.filteredEmiData = this.filteredEmiData.filter(item => item?.title?.match(this.selectedMonth + ' ' + this.selectedYear));
    }
    if (+this.otherSelectedFilter === 1) {
      this.filteredEmiData = this.filteredEmiData.filter(item => +item?.paid !== 0);
    } else if (+this.otherSelectedFilter === 2) {
      this.filteredEmiData = this.filteredEmiData.filter(item => +item?.paid === 0);
    }
  }

  resetFilter() {
    this.selectedMonth = '';
    this.selectedYear = '';
    this.otherSelectedFilter = 0;
    this.filterData();
  }
}
