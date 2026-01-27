
export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export enum UserRole {
  Admin = 'admin',
  Member = 'member'
}

export interface User {
  id: number;
  name: string;
  username?: string; // خاص بالمدير
  password?: string; // خاص بالمدير
  phone: string;
  joinDate: string;
  status: UserStatus;
  role: UserRole;
  monthlyPledge: number;
}

export enum TransactionType {
  Deposit = 'deposit',
  Expense = 'expense'
}

export interface Transaction {
  id: number;
  userId?: number;
  projectId?: number;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
}

export enum ProjectStatus {
  Voting = 'voting',
  Active = 'active',
  Completed = 'completed'
}

export interface Project {
  id: number;
  title: string;
  description: string;
  cost: number;
  status: ProjectStatus;
  votes: number;
  votedUserIds: number[];
  image?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
