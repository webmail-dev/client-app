import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RecordModel } from 'pocketbase';
import {
  CompleteProfilePayload,
  DalePuesUser,
  RegisterPayload,
  UserStatus,
  UserType,
} from '../models/auth.models';
import { PocketbaseService } from './pocketbase.service';

const TEMPORARY_ROLE_REDIRECTS: Record<UserType, string> = {
  client: '/home',
  merchant: '/home',
  courier: '/home',
  admin: '/home',
  support: '/home',
};

@Injectable({ providedIn: 'root' })
export class AuthPocketbaseService {
  private readonly pb = inject(PocketbaseService).getInstance();
  private readonly router = inject(Router);

  async login(email: string, password: string): Promise<DalePuesUser> {
    const authData = await this.pb.collection('users').authWithPassword(email, password);
    const user = await this.afterAuth(authData.record);
    return user;
  }

  async register(data: RegisterPayload): Promise<DalePuesUser> {
    const type = data.type || 'client';
    const status = this.getDefaultStatus(type);

    await this.pb.collection('users').create({
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      name: data.name,
      phone: data.phone,
      type,
      status,
      country: 'Venezuela',
      termsAccepted: data.termsAccepted,
      profileCompleted: this.checkProfileCompletion({
        phone: data.phone,
        type,
        termsAccepted: data.termsAccepted,
      } as DalePuesUser),
    });

    return this.login(data.email, data.password);
  }

  async loginWithGoogle(): Promise<DalePuesUser> {
    const authData = await this.pb.collection('users').authWithOAuth2({
      provider: 'google',
    });

    return this.afterAuth(authData.record);
  }

  logout(): void {
    this.pb.authStore.clear();
    void this.router.navigateByUrl('/login');
  }

  requestPasswordReset(email: string): Promise<boolean> {
    return this.pb.collection('users').requestPasswordReset(email);
  }

  getCurrentUser(): DalePuesUser | null {
    const record = this.pb.authStore.record;
    return record ? this.toUser(record) : null;
  }

  isAuthenticated(): boolean {
    return this.pb.authStore.isValid && !!this.pb.authStore.record;
  }

  hasRole(type: UserType | UserType[]): boolean {
    const user = this.getCurrentUser();
    const allowedTypes = Array.isArray(type) ? type : [type];
    return !!user?.type && allowedTypes.includes(user.type);
  }

  async refreshSession(): Promise<DalePuesUser | null> {
    if (!this.pb.authStore.isValid) {
      this.pb.authStore.clear();
      return null;
    }

    try {
      const authData = await this.pb.collection('users').authRefresh();
      return this.toUser(authData.record);
    } catch {
      this.pb.authStore.clear();
      return null;
    }
  }

  async completeProfile(payload: CompleteProfilePayload): Promise<DalePuesUser> {
    const current = this.getCurrentUser();

    if (!current?.id) {
      throw new Error('No hay un usuario autenticado.');
    }

    const type = payload.type || current.type || 'client';
    const data = {
      ...payload,
      type,
      status: current.status || this.getDefaultStatus(type),
      country: current.country || 'Venezuela',
      profileCompleted: this.checkProfileCompletion({ ...current, ...payload, type }),
    };

    const updated = await this.pb.collection('users').update(current.id, data);
    this.pb.authStore.save(this.pb.authStore.token, updated);
    return this.toUser(updated);
  }

  checkProfileCompletion(user: DalePuesUser): boolean {
    const type = user.type || 'client';
    const hasBaseData = !!user.phone && user.termsAccepted === true;

    if (!hasBaseData) {
      return false;
    }

    if (type === 'merchant') {
      return !!user.businessName && !!user.businessType;
    }

    if (type === 'courier') {
      return !!user.identityDocument && !!user.vehicleType;
    }

    return true;
  }

  getRedirectPath(type?: UserType): string {
    if (!type) {
      return '/complete-profile';
    }

    return TEMPORARY_ROLE_REDIRECTS[type] || '/home';
  }

  isBlockedOrInactive(user: DalePuesUser | null): boolean {
    return user?.status === 'blocked' || user?.status === 'inactive';
  }

  async redirectAfterAuth(user: DalePuesUser): Promise<void> {
    if (this.isBlockedOrInactive(user)) {
      this.logout();
      return;
    }

    if (!this.checkProfileCompletion(user)) {
      await this.router.navigateByUrl('/complete-profile');
      return;
    }

    await this.router.navigateByUrl(this.getRedirectPath(user.type));
  }

  toFriendlyError(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error || '');

    if (message.includes('Failed to authenticate')) {
      return 'Correo o contraseña inválidos.';
    }

    if (message.includes('not unique') || message.includes('validation')) {
      return 'Revisa los datos ingresados. Es posible que el correo ya esté registrado.';
    }

    if (message.includes('blocked') || message.includes('inactive')) {
      return 'Tu cuenta no está habilitada para ingresar.';
    }

    return 'No fue posible completar la operación. Inténtalo nuevamente.';
  }

  private async afterAuth(record: RecordModel): Promise<DalePuesUser> {
    const normalized = await this.ensureUserDefaults(record);

    if (this.isBlockedOrInactive(normalized)) {
      this.pb.authStore.clear();
      throw new Error('blocked_or_inactive');
    }

    await this.touchLastLogin(normalized.id);
    return this.getCurrentUser() || normalized;
  }

  private async ensureUserDefaults(record: RecordModel): Promise<DalePuesUser> {
    const user = this.toUser(record);
    const type = user.type || 'client';
    const patch: Partial<DalePuesUser> = {};

    if (!user.type) {
      patch.type = type;
    }

    if (!user.status) {
      patch.status = this.getDefaultStatus(type);
    }

    if (!user.country) {
      patch.country = 'Venezuela';
    }

    if (user.profileCompleted !== this.checkProfileCompletion({ ...user, ...patch })) {
      patch.profileCompleted = this.checkProfileCompletion({ ...user, ...patch });
    }

    if (Object.keys(patch).length === 0) {
      return user;
    }

    const updated = await this.pb.collection('users').update(user.id, patch);
    this.pb.authStore.save(this.pb.authStore.token, updated);
    return this.toUser(updated);
  }

  private async touchLastLogin(userId: string): Promise<void> {
    try {
      const updated = await this.pb.collection('users').update(userId, {
        lastLoginAt: new Date().toISOString(),
      });
      this.pb.authStore.save(this.pb.authStore.token, updated);
    } catch {
      // Non-critical. Auth must not fail if this audit field cannot be updated.
    }
  }

  private getDefaultStatus(type: UserType): UserStatus {
    if (type === 'merchant' || type === 'courier') {
      return 'pending';
    }

    return 'active';
  }

  private toUser(record: RecordModel): DalePuesUser {
    return {
      id: record.id,
      email: record['email'],
      name: record['name'],
      phone: record['phone'],
      type: record['type'],
      status: record['status'],
      avatar: record['avatar'],
      address: record['address'],
      city: record['city'],
      state: record['state'],
      country: record['country'],
      roleDescription: record['roleDescription'],
      lastLoginAt: record['lastLoginAt'],
      profileCompleted: record['profileCompleted'],
      termsAccepted: record['termsAccepted'],
      businessName: record['businessName'],
      businessType: record['businessType'],
      identityDocument: record['identityDocument'],
      vehicleType: record['vehicleType'],
    };
  }
}
