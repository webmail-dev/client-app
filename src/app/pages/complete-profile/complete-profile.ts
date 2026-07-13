import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompleteProfilePayload, UserType } from '../../models/auth.models';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';

@Component({
  selector: 'app-complete-profile-page',
  imports: [ReactiveFormsModule],
  templateUrl: './complete-profile.html',
  styleUrl: '../login/login.css',
})
export class CompleteProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthPocketbaseService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly userTypes: Array<{ value: UserType; label: string }> = [
    { value: 'client', label: 'Cliente' },
    { value: 'merchant', label: 'Comercio local' },
    { value: 'courier', label: 'Repartidor o mensajero' },
  ];

  readonly selectedType = signal<UserType>('client');
  readonly requiresMerchantData = computed(() => this.selectedType() === 'merchant');
  readonly requiresCourierData = computed(() => this.selectedType() === 'courier');

  readonly form = this.fb.nonNullable.group({
    name: [''],
    phone: ['', [Validators.required]],
    type: ['client' as UserType, [Validators.required]],
    address: [''],
    city: [''],
    state: [''],
    businessName: [''],
    businessType: [''],
    identityDocument: [''],
    vehicleType: [''],
    termsAccepted: [false, [Validators.requiredTrue]],
  });

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();

    if (!user) {
      void this.router.navigateByUrl('/login');
      return;
    }

    const type = user.type || 'client';
    this.selectedType.set(type);
    this.form.patchValue({
      name: user.name || '',
      phone: user.phone || '',
      type,
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      businessName: user.businessName || '',
      businessType: user.businessType || '',
      identityDocument: user.identityDocument || '',
      vehicleType: user.vehicleType || '',
      termsAccepted: user.termsAccepted || false,
    });

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.selectedType.set(value);
        this.syncConditionalValidators(value);
      });

    this.syncConditionalValidators(type);
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const user = await this.auth.completeProfile(this.form.getRawValue() as CompleteProfilePayload);
      await this.auth.redirectAfterAuth(user);
    } catch (error) {
      this.errorMessage = this.auth.toFriendlyError(error);
    } finally {
      this.loading = false;
    }
  }

  private syncConditionalValidators(type: UserType): void {
    const merchantControls = [this.form.controls.businessName, this.form.controls.businessType];
    const courierControls = [this.form.controls.identityDocument, this.form.controls.vehicleType];

    for (const control of merchantControls) {
      control.clearValidators();
      if (type === 'merchant') {
        control.addValidators(Validators.required);
      }
      control.updateValueAndValidity({ emitEvent: false });
    }

    for (const control of courierControls) {
      control.clearValidators();
      if (type === 'courier') {
        control.addValidators(Validators.required);
      }
      control.updateValueAndValidity({ emitEvent: false });
    }
  }
}
