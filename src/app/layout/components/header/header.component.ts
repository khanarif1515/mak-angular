import { Component } from '@angular/core';
import { SideNavbarComponent } from '../side-navbar/side-navbar.component';

@Component({
  selector: 'app-header',
  imports: [SideNavbarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
