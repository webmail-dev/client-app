import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthPocketbaseService);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  loading = false;
  googleLoading = false;
  errorMessage = '';

  async submit(): Promise<void> {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const user = await this.auth.login(this.form.controls.email.value, this.form.controls.password.value);
      await this.auth.redirectAfterAuth(user);
    } catch (error) {
      this.errorMessage = this.auth.toFriendlyError(error);
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    if (this.googleLoading) {
      return;
    }

    this.googleLoading = true;
    this.errorMessage = '';

    try {
      const user = await this.auth.loginWithGoogle();
      await this.auth.redirectAfterAuth(user);
    } catch (error) {
      this.errorMessage = this.auth.toFriendlyError(error);
    } finally {
      this.googleLoading = false;
    }
  }

  async requestPasswordReset(): Promise<void> {
    const email = this.form.controls.email.value;

    if (!email) {
      this.form.controls.email.markAsTouched();
      this.errorMessage = 'Ingresa tu correo para solicitar recuperación de contraseña.';
      return;
    }

    try {
      await this.auth.requestPasswordReset(email);
      this.errorMessage = 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.';
    } catch (error) {
      this.errorMessage = this.auth.toFriendlyError(error);
    }
  }
}
