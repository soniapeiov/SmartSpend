// User Types
export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  createdAt: number;
}

// Expense Types
export interface Expense {
  id: number;
  userId: number;
  date: string;
  time: string;
  category: 'Food' | 'Other' | 'Transportation' | 'Home' | 'Shopping';
  amount: number;
  type: 'scan' | 'manual' | 'gallery';
  imageUrl?: string;
  createdAt: number;
}

// Period Type
export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Mock User
export const mockUser: User = {
  id: 1,
  fullName: 'Şükran Kurt',
  email: 'sukran@example.com',
  phoneNumber: '+905551234567',
  createdAt: new Date('2026-01-15T10:30:00').getTime(),
};

// Mock Expenses (Güncel tarihlerle)
const mockExpenses: Expense[] = [
  // Bugün (02/05/2026)
  {
    id: 1,
    userId: 1,
    date: '02/05/2026',
    time: '18:45',
    category: 'Food',
    amount: 45.50,
    type: 'scan',
    createdAt: new Date('2026-05-02T18:45:00').getTime(),
  },
  {
    id: 2,
    userId: 1,
    date: '02/05/2026',
    time: '14:20',
    category: 'Transportation',
    amount: 12.00,
    type: 'manual',
    createdAt: new Date('2026-05-02T14:20:00').getTime(),
  },
  
  // Dün (01/05/2026)
  {
    id: 3,
    userId: 1,
    date: '01/05/2026',
    time: '20:15',
    category: 'Shopping',
    amount: 89.99,
    type: 'gallery',
    createdAt: new Date('2026-05-01T20:15:00').getTime(),
  },
  {
    id: 4,
    userId: 1,
    date: '01/05/2026',
    time: '12:30',
    category: 'Food',
    amount: 23.75,
    type: 'scan',
    createdAt: new Date('2026-05-01T12:30:00').getTime(),
  },
  {
    id: 8,
    userId: 1,
    date: '01/05/2026',
    time: '11:00',
    category: 'Shopping',
    amount: 67.80,
    type: 'gallery',
    createdAt: new Date('2026-05-01T11:00:00').getTime(),
  },
  
  // Son 7 gün
  {
    id: 5,
    userId: 1,
    date: '30/04/2026',
    time: '19:00',
    category: 'Home',
    amount: 120.00,
    type: 'manual',
    createdAt: new Date('2026-04-30T19:00:00').getTime(),
  },
  {
    id: 6,
    userId: 1,
    date: '29/04/2026',
    time: '13:45',
    category: 'Food',
    amount: 18.50,
    type: 'scan',
    createdAt: new Date('2026-04-29T13:45:00').getTime(),
  },
  {
    id: 7,
    userId: 1,
    date: '28/04/2026',
    time: '16:20',
    category: 'Transportation',
    amount: 25.00,
    type: 'manual',
    createdAt: new Date('2026-04-28T16:20:00').getTime(),
  },
  
  // Son 30 gün (Nisan)
  {
    id: 9,
    userId: 1,
    date: '25/04/2026',
    time: '15:30',
    category: 'Food',
    amount: 32.40,
    type: 'scan',
    createdAt: new Date('2026-04-25T15:30:00').getTime(),
  },
  {
    id: 10,
    userId: 1,
    date: '20/04/2026',
    time: '09:15',
    category: 'Home',
    amount: 85.00,
    type: 'manual',
    createdAt: new Date('2026-04-20T09:15:00').getTime(),
  },
  {
    id: 11,
    userId: 1,
    date: '18/04/2026',
    time: '17:50',
    category: 'Transportation',
    amount: 30.00,
    type: 'manual',
    createdAt: new Date('2026-04-18T17:50:00').getTime(),
  },
  {
    id: 12,
    userId: 1,
    date: '15/04/2026',
    time: '12:00',
    category: 'Food',
    amount: 41.20,
    type: 'scan',
    createdAt: new Date('2026-04-15T12:00:00').getTime(),
  },
  {
    id: 13,
    userId: 1,
    date: '12/04/2026',
    time: '14:25',
    category: 'Other',
    amount: 15.99,
    type: 'manual',
    createdAt: new Date('2026-04-12T14:25:00').getTime(),
  },
  {
    id: 14,
    userId: 1,
    date: '10/04/2026',
    time: '19:40',
    category: 'Shopping',
    amount: 125.50,
    type: 'gallery',
    createdAt: new Date('2026-04-10T19:40:00').getTime(),
  },
  {
    id: 15,
    userId: 1,
    date: '08/04/2026',
    time: '10:10',
    category: 'Food',
    amount: 28.75,
    type: 'scan',
    createdAt: new Date('2026-04-08T10:10:00').getTime(),
  },
  
  // Son 365 gün (Mart)
  {
    id: 16,
    userId: 1,
    date: '28/03/2026',
    time: '16:00',
    category: 'Home',
    amount: 95.00,
    type: 'manual',
    createdAt: new Date('2026-03-28T16:00:00').getTime(),
  },
  {
    id: 17,
    userId: 1,
    date: '25/03/2026',
    time: '13:20',
    category: 'Transportation',
    amount: 18.50,
    type: 'manual',
    createdAt: new Date('2026-03-25T13:20:00').getTime(),
  },
  {
    id: 18,
    userId: 1,
    date: '20/03/2026',
    time: '11:45',
    category: 'Food',
    amount: 52.30,
    type: 'scan',
    createdAt: new Date('2026-03-20T11:45:00').getTime(),
  },
  {
    id: 19,
    userId: 1,
    date: '15/03/2026',
    time: '18:30',
    category: 'Shopping',
    amount: 110.00,
    type: 'gallery',
    createdAt: new Date('2026-03-15T18:30:00').getTime(),
  },
  {
    id: 20,
    userId: 1,
    date: '10/03/2026',
    time: '14:00',
    category: 'Other',
    amount: 22.50,
    type: 'manual',
    createdAt: new Date('2026-03-10T14:00:00').getTime(),
  },
];

// ✅ State gibi kullanmak için let
let expenses = [...mockExpenses];

// ✅ Add Expense
export const addExpense = (newExpense: Omit<Expense, 'id'>): void => {
  const newId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
  const expense: Expense = {
    ...newExpense,
    id: newId,
  };
  expenses.push(expense);
};

// ✅ Delete Expense
export const deleteExpense = (id: number): void => {
  const index = expenses.findIndex(expense => expense.id === id);
  if (index !== -1) {
    expenses.splice(index, 1);
  }
};

// ✅ Update Expense
export const updateExpense = (id: number, updatedData: Partial<Expense>): void => {
  const index = expenses.findIndex(expense => expense.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updatedData };
  }
};

// ✅ Get Expenses by Period
export const getExpensesByPeriod = (period: PeriodType): Expense[] => {
  const now = new Date('2026-05-02T23:59:59').getTime();
  
  return expenses.filter(expense => {
    switch (period) {
      case 'daily':
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        return expense.createdAt >= oneDayAgo && expense.createdAt <= now;
      
      case 'weekly':
        const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
        return expense.createdAt >= weekAgo && expense.createdAt <= now;
      
      case 'monthly':
        const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
        return expense.createdAt >= monthAgo && expense.createdAt <= now;
      
      case 'yearly':
        const yearAgo = now - (365 * 24 * 60 * 60 * 1000);
        return expense.createdAt >= yearAgo && expense.createdAt <= now;
      
      default:
        return false;
    }
  }).sort((a, b) => b.createdAt - a.createdAt);
};

// ✅ Get Total Expenses
export const getTotalExpenses = (period: PeriodType): number => {
  const filtered = getExpensesByPeriod(period);
  return filtered.reduce((sum, expense) => sum + expense.amount, 0);
};

// ✅ Get Expenses by Category (SADECE BİR TANE!)
export const getExpensesByCategory = (period: PeriodType = 'monthly'): { category: string; amount: number; percentage: number }[] => {
  const periodExpenses = getExpensesByPeriod(period);
  const total = getTotalExpenses(period);

  if (total === 0) return [];

  // Kategorilere göre grupla
  const categoryMap: { [key: string]: number } = {};
  
  periodExpenses.forEach((expense) => {
    if (categoryMap[expense.category]) {
      categoryMap[expense.category] += expense.amount;
    } else {
      categoryMap[expense.category] = expense.amount;
    }
  });

  // Yüzdelikleri hesapla
  return Object.keys(categoryMap).map((category) => ({
    category,
    amount: categoryMap[category],
    percentage: Math.round((categoryMap[category] / total) * 100),
  }));
};