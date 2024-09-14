import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VariablesService } from 'src/app/shared/services';

@Component({
  selector: 'app-header-v2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-v2.component.html',
  styleUrl: './header-v2.component.scss'
})
export class HeaderV2Component {

  constructor(
    public vars: VariablesService
  ) {}

  // goToAllFundraiser() {
  //   this.events.sendSystemEvent({
  //     eventName: 'click_on_contribute',
  //     info_1: 'header'
  //   }).subscribe(_ => _);
  //   const abandonedCart = this.storage.get('abandonedCartOtd');
  //   if (abandonedCart?.link) {
  //     this.util.router.navigate([abandonedCart?.link], { queryParams: { donate: 1, payment: 'form' }, queryParamsHandling: 'merge'});
  //   } else {
  //     this.util.navigate('fundraisers');
  //   }
  // }
}
