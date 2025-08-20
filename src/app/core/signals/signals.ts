import { Component, model } from '@angular/core';

@Component({
  selector: 'app-signals',
  imports: [],
  templateUrl: './signals.html',
  styleUrl: './signals.scss'
})
export class Signals {

  count = model(0);

  increase() {
    this.count.update(cur => cur + 1);
  }

  decrease() {
    this.count.update(cur => cur - 1);
  }
}
