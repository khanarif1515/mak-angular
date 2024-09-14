import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IErrors } from 'src/app/shared/model/form-error.model';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {

  @Input() group?: FormGroup;
  @Input() control?: FormControl;
  @Input() type: string = "";
  @Input() label: string = '';
  @Input() note: string = '';
  @Input() placeHolder: string = '';
  @Input() preIcon?: string;
  @Input() postIcon?: string;
  @Input() errorMessage?: IErrors;
  @Input() customClass?: string;
  @Input() min?: number;
  @Input() max?: number;
  @Output() onChange = new EventEmitter();
  @ViewChild('childInput') childInput?: ElementRef;

  constructor() { }

  wrapClick() {
    this.childInput?.nativeElement?.focus();
  }

  onInputChange() {
    this.onChange.emit(this.control?.value);
  }

  focusInput(e?: any) {
  }

}
