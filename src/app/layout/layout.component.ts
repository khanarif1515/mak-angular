import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VariablesService } from 'src/app/shared/services';
import { HeaderComponent } from "../core/header/header.component";
import { FooterComponent } from "../core/footer/footer.component";
import { HeaderV2Component } from '../core/header-v2/header-v2.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeaderV2Component, FooterComponent],
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
