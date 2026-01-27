
import { User, UserRole, UserStatus, Project, ProjectStatus, Transaction, TransactionType } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: "مشرف الصندوق",
    username: "admin",
    password: "admin",
    phone: "0000",
    joinDate: "2023-01-01",
    status: UserStatus.Active,
    role: UserRole.Admin,
    monthlyPledge: 10.0
  },
  {
    id: 2,
    name: "أحمد محمد",
    phone: "1234",
    joinDate: "2023-02-15",
    status: UserStatus.Active,
    role: UserRole.Member,
    monthlyPledge: 10.0
  },
  {
    id: 3,
    name: "سارة علي",
    phone: "5678",
    joinDate: "2023-03-10",
    status: UserStatus.Active,
    role: UserRole.Member,
    monthlyPledge: 10.0
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "بناء بئر مياه",
    description: "مشروع حفر بئر مياه في قرية نائية لتوفير المياه الصالحة للشرب.",
    cost: 1500.0,
    status: ProjectStatus.Voting,
    votes: 1,
    votedUserIds: [2],
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "كفالة أيتام (شهري)",
    description: "توفير احتياجات 5 أيتام بشكل شهري.",
    cost: 500.0,
    status: ProjectStatus.Active,
    votes: 5,
    votedUserIds: [],
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    userId: 1,
    type: TransactionType.Deposit,
    amount: 10.0,
    date: new Date('2023-04-01').toISOString(),
    description: "اشتراك شهري"
  },
  {
    id: 2,
    userId: 2,
    type: TransactionType.Deposit,
    amount: 10.0,
    date: new Date('2023-04-01').toISOString(),
    description: "اشتراك شهري"
  }
];
