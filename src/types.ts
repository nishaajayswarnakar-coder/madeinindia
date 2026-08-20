export type Role = 'buyer' | 'supplier' | 'admin';

export interface User {
  uid: string;
  email: string;
  name?: string;
  role: Role;
  phone?: string;
  companyId?: string;
  emailVerified?: boolean;
  createdAt: number;
}

export interface Company {
  id: string; // Document ID
  userId: string;
  name: string;
  slug: string;
  description?: string;
  type?: string;
  city?: string;
  state?: string;
  verified?: boolean;
  createdAt: number;
}

export interface Product {
  id: string; // Document ID
  companyId: string;
  name: string;
  category: string;
  price?: number;
  moq?: number;
  unit?: string;
  description?: string;
  createdAt: number;
}

export interface Requirement {
  id: string; // Document ID
  buyerId: string;
  title: string;
  category: string;
  quantity: number;
  unit?: string;
  location?: string;
  status: 'open' | 'closed' | 'fulfilled';
  createdAt: number;
}

export interface Enquiry {
  id: string; // Document ID
  buyerId: string;
  supplierId: string;
  productId?: string;
  requirementId?: string;
  message: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: number;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}
