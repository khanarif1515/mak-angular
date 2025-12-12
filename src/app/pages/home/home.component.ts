import { Component, effect, inject } from '@angular/core';
import { VariablesService } from '../../shared/services/variables/variables.service';
import { UtilsService } from '../../shared/services/utils/utils.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  private readonly vars = inject(VariablesService);
  // private readonly util = inject(UtilsService);

  constructor() {
    effect(() => {
      console.log('Global updated:', this.vars.globalVar());
    });
  }

  ngOnInit() {
    // console.log(this.vars.actRoute.snapshot.queryParams);

  }

}
