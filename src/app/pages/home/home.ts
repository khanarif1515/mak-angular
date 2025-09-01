import { Component } from '@angular/core';
import { Signals } from "../../core/signals/signals";

@Component({
  selector: 'app-home',
  imports: [Signals],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  masterCount = 50;

  resetCount() {
    this.masterCount = 0;
  }

}
