import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-navbar',
  imports: [RouterModule],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {

  actBtns = [
    { link: '/', label: 'Home' },
    { link: '/honda/amaze', label: 'Honda Amaze - MH-12-PQ-4787' },
    { link: '/404', label: '404' },
    { link: '/signin', label: 'Login' },
    { link: '/signup', label: 'Create Account' },
    { link: '/stories/savemanisht', label: 'Save Manisht' },
    { link: '/stories/savebabyofgeetha', label: 'Save Baby of Geetha' }
  ];

  constructor() {}
}
