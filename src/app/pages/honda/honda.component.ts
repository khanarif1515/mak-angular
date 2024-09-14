import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InrFormatPipe } from 'src/app/shared/pipes/inr-format/inr-format.pipe';
import { ApiService, UtilService } from 'src/app/shared/services';
import { API_URLS } from 'src/environments/api-urls';

@Component({
  selector: 'app-honda',
  standalone: true,
  imports: [CommonModule, InrFormatPipe, FormsModule],
  templateUrl: './honda.component.html',
  styleUrl: './honda.component.scss'
})
export class HondaComponent {

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

  constructor(
    private actRoute: ActivatedRoute,
    private api: ApiService,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.customTag = this.actRoute.snapshot.params?.['tag'];
    this.getDetails();
  }

  getDetails() {
    this.api.get('honda/' + this.customTag).subscribe({
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
        console.log(res);
      },
      error: (err: any) => {
        // this.util.router.navigate(['/404']);
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
