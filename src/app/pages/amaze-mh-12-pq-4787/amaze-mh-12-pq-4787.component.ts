import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/shared';
import { InrFormatPipe } from 'src/app/shared/pipes/inr-format/inr-format.pipe';
import { API_URLS } from 'src/environments/api-urls';

@Component({
  selector: 'app-amaze-mh-12-pq-4787',
  standalone: true,
  imports: [CommonModule, InrFormatPipe, FormsModule],
  templateUrl: './amaze-mh-12-pq-4787.component.html',
  styleUrl: './amaze-mh-12-pq-4787.component.scss'
})
export class AmazeMH12PQ4787Component {

  amazeCost: any;
  emiData: any[] = [];
  filterMonths = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  filterYears = [''];
  filterOthers = [{ id: 0, val: '' }, { id: 1, val: 'only paid months' }, { id: 2, val: 'only unpaid months' }];
  selectedMonth = '';
  selectedYear = '';
  otherSelectedFilter = 0;
  filteredEmiData: any[] = []

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    this.api.get(API_URLS.GET_HONDA_AMAZE_DETAILS).subscribe({
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
        this.filteredEmiData = this.emiData;
        console.log(res);
      },
      error: (err: any) => {
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
