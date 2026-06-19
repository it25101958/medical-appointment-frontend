export interface LoadCurrent {
  userId: number;
  roleType: number;
  accessLevel?: string;
}

export interface PageableResponse<T = unknown> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface AdminUserDetails {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  NIC: string;
  address: string;
  isActive: boolean;
  roleType: number;
  roleName?: string;
  createdAt: string;
  updatedAt: string;
}
