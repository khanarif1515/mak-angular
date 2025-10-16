import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { VarS } from '../../shared/services';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-signup',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-signup.html',
  styleUrl: './login-signup.scss'
})
export class LoginSignup {
  readonly vars = inject(VarS);
  private readonly fb = inject(FormBuilder);
  @ViewChildren('formInput') formInputs!: QueryList<ElementRef>;

  loginForm: FormGroup = this.fb.group({
    user_name: ['', [Validators.required, Validators.pattern(this.vars.regex.userName)]],
    password: ['', [Validators.required, Validators.pattern(this.vars.regex.password)]],
  });

  showPassword = false;

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.focusFirstInvalid();
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log('✅ Form submitted successfully:', this.loginForm.value);
  }

  focusFirstInvalid() {
    for (const key of Object.keys(this.f)) {
      if (this.f[key].invalid) {
        const invalidInput = this.formInputs.find((input) => input.nativeElement.name === key);
        if (invalidInput) invalidInput.nativeElement.focus();
        break;
      }
    }
  }
}
