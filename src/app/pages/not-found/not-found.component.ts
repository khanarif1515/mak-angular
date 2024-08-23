import { Component, OnInit } from '@angular/core';
import { VariablesService } from 'src/app/shared/services';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit {

  constructor(
    public vars: VariablesService
  ) { }

  ngOnInit(): void { }

}
