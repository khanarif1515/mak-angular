import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OptimizedImageComponent } from "../../../core/optimized-image/optimized-image.component";
import { ApiService, UtilService, VarService } from '../../../shared/services';
import { ApiEndPoints } from '../../../shared/models/api-endpoints.model';

interface INavLinks { label: string; link: string; params?: { [key: string]: string } };

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgClass, OptimizedImageComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  readonly api = inject(ApiService);
  readonly vars = inject(VarService);
  readonly util = inject(UtilService);

  navLinks: INavLinks[] = [
    { label: 'Home', link: '/' },
    { label: 'About Us', link: '/about-us', params: { utm_source: 'test', utm_medium: 'medium', sgdv: 'dfgb' } },
    { label: 'Profile', link: '/profile', params: { utm_source: 'test1', vfh: 'sdgtr' } },
    { label: 'Story', link: '/story/supportzainab' },
    { label: 'Honda', link: '/vehicle/honda' },
    { label: 'Honda Amaze', link: '/vehicle/honda/amaze' },
    { label: '404', link: '/404' },
    { label: 'unknown', link: '/unknown' }
  ];

  ngOnInit() {
    this.getAllCmpaigns();
  }

  getAllCmpaigns() {
    this.api.request('get', ApiEndPoints.allCampaigns).subscribe({
      next: (res: any) => {
        const camps: [] = res?.data;
        const newLinks: INavLinks[] = [];
        camps.forEach((item: any) => {
          if (item?.custom_tag) {
            newLinks.push({ label: item.custom_tag, link: '/story/' + item.custom_tag });
          }
        });
        this.navLinks = [...this.navLinks, ...newLinks];
      },
      error: (err: any) => { }
    });
  }
}
