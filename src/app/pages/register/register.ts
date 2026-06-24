import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserType } from '../../models/auth.models';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../login/login.css',
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthPocketbaseService);

  readonly userTypes: Array<{ value: UserType; label: string }> = [
    { value: 'client', label: 'Cliente' },
    { value: 'merchant', label: 'Comercio afiliado' },
    { value: 'courier', label: 'Repartidor / mensajero' },
  ];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    type: ['client' as UserType, [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required]],
    termsAccepted: [false, [Validators.requiredTrue]],
  });

  loading = false;
  errorMessage = '';

  async submit(): Promise<void> {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.controls.password.value !== this.form.controls.passwordConfirm.value) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const user = await this.auth.register(this.form.getRawValue());
      await this.auth.redirectAfterAuth(user);
    } catch (error) {
      this.errorMessage = this.auth.toFriendlyError(error);
    } finally {
      this.loading = false;
    }
  }
}
