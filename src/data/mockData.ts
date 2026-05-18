// src/data/mockData.ts
export type Expense = {
  id: number;
  amount: number;
  category: string;
  date: number;
  createdAt: number;
  userId: string;
  imageUrl?: string;
  type?: 'scan' | 'gallery' | 'manual';
};

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

// ✅ Mock expenses (multi-user data)
let mockExpenses: Expense[] = [
  // Daily (son 24 saat)
  {
    id: 1,
    amount: 45.50,
    category: 'Food',
    date: Date.now() - 2 * 60 * 60 * 1000,
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    userId: 'user123',
    type: 'manual',
  },
  {
    id: 2,
    amount: 12.00,
    category: 'Transportation',
    date: Date.now() - 5 * 60 * 60 * 1000,
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
    userId: 'user123',
    type: 'manual',
  },
  
  // Weekly (2-5 gün önce)
  {
    id: 3,
    amount: 89.99,
    category: 'Shopping',
    date: Date.now() - 2 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    userId: 'user123',
    type: 'manual',
  },
  {
    id: 4,
    amount: 23.75,
    category: 'Food',
    date: Date.now() - 3 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    userId: 'user123',
    type: 'manual',
  },
  {
    id: 5,
    amount: 67.80,
    category: 'Shopping',
    date: Date.now() - 5 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    userId: 'user123',
    type: 'manual',
  },
  
  // Monthly (10-20 gün önce)
  {
    id: 6,
    amount: 150.00,
    category: 'Home',
    date: Date.now() - 10 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    userId: 'user123',
    type: 'manual',
  },
  {
    id: 7,
    amount: 80.50,
    category: 'Food',
    date: Date.now() - 15 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    userId: 'user123',
    type: 'manual',
  },
  {
    id: 8,
    amount: 35.20,
    category: 'Transportation',
    date: Date.now() - 20 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    userId: 'user123',
    type: 'manual',
  },
  
  // Farklı user (test)
  {
    id: 9,
    amount: 999.99,
    category: 'Other',
    date: Date.now() - 1 * 60 * 60 * 1000,
    createdAt: Date.now() - 1 * 60 * 60 * 1000,
    userId: 'user456',
    type: 'manual',
  },
];


// ✅ Helper: Filter by userId parameter + period
const filterByUserAndPeriod = (userId: string, period: PeriodType): Expense[] => {
  const now = Date.now();
  let periodStart = 0;

  switch (period) {
    case 'daily':
      periodStart = now - 24 * 60 * 60 * 1000;
      break;
    case 'weekly':
      periodStart = now - 7 * 24 * 60 * 60 * 1000;
      break;
    case 'monthly':
      periodStart = now - 30 * 24 * 60 * 60 * 1000;
      break;
    case 'yearly':
      periodStart = now - 365 * 24 * 60 * 60 * 1000;
      break;
  }

  return mockExpenses.filter(
    (expense) => 
      expense.userId === userId &&  // ✅ Parameter'dan geliyor
      expense.createdAt >= periodStart
  );
};

// ✅ Get total expenses (userId parameter)
export const getTotalExpenses = (userId: string, period: PeriodType): number => {
  const expenses = filterByUserAndPeriod(userId, period);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// ✅ Get expenses by period (userId parameter)
export const getExpensesByPeriod = (userId: string, period: PeriodType): Expense[] => {
  return filterByUserAndPeriod(userId, period).sort((a, b) => b.createdAt - a.createdAt);
};

// ✅ Get expenses by category (userId parameter)
export const getExpensesByCategory = (
  userId: string, 
  period: PeriodType
): { category: string; amount: number; percentage: number }[] => {
  const expenses = filterByUserAndPeriod(userId, period);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (total === 0) return [];

  const categoryTotals: { [key: string]: number } = {};
  
  expenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: Math.round((amount / total) * 100),
  }));
};

// ✅ Add expense (userId parameter)
export const addExpense = (userId: string, expense: Omit<Expense, 'id' | 'userId'>) => {
  mockExpenses.push({
    ...expense,
    id: Date.now(),
    userId,  // ✅ Parameter'dan geliyor
  });
};

// ✅ Update expense (userId parameter - security check)
export const updateExpense = (userId: string, id: number, updates: Partial<Expense>) => {
  const index = mockExpenses.findIndex(
    (e) => e.id === id && e.userId === userId  // ✅ Security: sadece kendi expense'ini update edebilir
  );
  
  if (index !== -1) {
    mockExpenses[index] = { ...mockExpenses[index], ...updates };
  }
};

// ✅ Delete expense (userId parameter - security check)
export const deleteExpense = (userId: string, id: number) => {
  mockExpenses = mockExpenses.filter(
    (e) => !(e.id === id && e.userId === userId)  // ✅ Security: sadece kendi expense'ini silebilir
  );
};

// ✅ Get all expenses (debugging - admin only)
export const getAllExpenses = (): Expense[] => {
  return mockExpenses;
};