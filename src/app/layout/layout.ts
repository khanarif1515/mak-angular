import { Component, inject } from '@angular/core';
import { VarS } from '../shared/services';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

  readonly vars = inject(VarS);
}
