import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService, VariablesService } from 'src/app/shared/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  links: { link: string, label: string }[] = [
    { link: '/honda/amaze', label: 'Amaze Costing' },
    { link: '/', label: 'Home' },
    { link: '/thankyou', label: 'Thank You' },
    { link: '/404', label: '404' }
  ];

  campaings: any[] = [];

  constructor(
    private api: ApiService,
    public router: Router,
    public vars: VariablesService
  ) { }

  ngOnInit(): void {
    this.getAllCampaigns();
  }

  getAllCampaigns() {
    this.api.get('campaigns').subscribe({
      next: (res: any) => {
        this.campaings = res?.data;
        this.campaings.forEach(val => {
          if (val?.custom_tag) {
            this.links.push({ link: '/stories/'+val?.custom_tag, label: val?.custom_tag });
          }
        });
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
