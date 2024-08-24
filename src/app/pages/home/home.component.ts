import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService, VariablesService } from 'src/app/shared/services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  // campaings: any[] = [];

  constructor(
    private api: ApiService,
    public vars: VariablesService
  ) { }

  ngOnInit(): void {
    // this.getAllCampaigns();
  }

  // getAllCampaigns() {
  //   this.api.get('campaigns').subscribe({
  //     next: (res: any) => {
  //       this.campaings = res?.data;
  //       console.log(res);
  //     },
  //     error: (err: any) => {
  //       console.log(err);
  //     }
  //   });
  // }
}
