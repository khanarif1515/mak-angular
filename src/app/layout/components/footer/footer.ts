import { Component, inject } from '@angular/core';
import { VarS } from '../../../shared/services';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

  readonly vars = inject(VarS);

}
