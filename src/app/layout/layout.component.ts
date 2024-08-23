import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../core/header/header.component";
import { FooterComponent } from "../core/footer/footer.component";
import { VariablesService } from 'src/app/shared/services';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  constructor(
    public vars: VariablesService
  ) { }

  ngOnInit(): void {
  }
}
