export type UserType = 'client' | 'merchant' | 'courier' | 'admin' | 'support';

export type UserStatus = 'active' | 'pending' | 'rejected' | 'blocked' | 'inactive';

export interface DalePuesUser {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  type?: UserType;
  status?: UserStatus;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  roleDescription?: string;
  lastLoginAt?: string;
  profileCompleted?: boolean;
  termsAccepted?: boolean;
  businessName?: string;
  businessType?: string;
  identityDocument?: string;
  vehicleType?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  type: UserType;
  termsAccepted: boolean;
}

export interface CompleteProfilePayload {
  name?: string;
  phone: string;
  type: UserType;
  termsAccepted: boolean;
  address?: string;
  city?: string;
  state?: string;
  businessName?: string;
  businessType?: string;
  identityDocument?: string;
  vehicleType?: string;
}
