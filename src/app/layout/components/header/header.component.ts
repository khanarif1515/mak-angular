import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  links = [
    { label: 'Home', path: '' },
    { label: 'Signin', path: 'signin' },
    { label: '404', path: '404' }
  ];

}
