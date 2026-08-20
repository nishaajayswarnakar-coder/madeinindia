import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { OperationType, Company, Product, Requirement, Enquiry } from '../types';
import { handleFirestoreError } from './errorHandling';

export class CompanyService {
  static async getCompany(id: string): Promise<Company | null> {
    try {
      const snap = await getDoc(doc(db, 'companies', id));
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as Company;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `companies/${id}`);
      return null;
    }
  }

  static async getCompanies(): Promise<Company[]> {
    try {
      const snap = await getDocs(collection(db, 'companies'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Company));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'companies');
      return [];
    }
  }

  static async createCompany(id: string, data: Omit<Company, 'id' | 'createdAt'>): Promise<void> {
    try {
      await setDoc(doc(db, 'companies', id), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `companies/${id}`);
    }
  }
}

export class ProductService {
  static async getProducts(): Promise<Product[]> {
    try {
      const snap = await getDocs(collection(db, 'products'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'products');
      return [];
    }
  }

  static async createProduct(id: string, data: Omit<Product, 'id' | 'createdAt'>): Promise<void> {
    try {
      await setDoc(doc(db, 'products', id), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `products/${id}`);
    }
  }
}

export class RequirementService {
  static async getRequirements(): Promise<Requirement[]> {
    try {
      const snap = await getDocs(collection(db, 'requirements'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Requirement));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'requirements');
      return [];
    }
  }

  static async createRequirement(id: string, data: Omit<Requirement, 'id' | 'createdAt'>): Promise<void> {
    try {
      await setDoc(doc(db, 'requirements', id), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `requirements/${id}`);
    }
  }
}
