import { open } from '@op-engineering/op-sqlite';

// ================== TYPES ==================

export type User = {
  firebaseUid: string;
  email: string;
  fullName: string;
  phone: string;
  createdAt: number;
};

export type Expense = {
  id: number;
  amount: number;
  category: string;
  date: number;
  createdAt: number;
  userId: string; // firebaseUid reference
  imageUrl?: string;
  type?: 'scan' | 'gallery' | 'manual';
};

const DATABASE_NAME = 'ExpenseTracker.db';

let db: any = null;

// ================== DATABASE SETUP ==================

export const openDatabase = async () => {
  if (db) {
    return db;
  }

  try {
    db = open({
      name: DATABASE_NAME,
    });
    return db;
  } catch (error) {
    console.error('❌ Error opening database:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    try {
      db.close();
      db = null;
    } catch (error) {
      console.error('❌ Error closing database:', error);
    }
  }
};

export const createTables = async (): Promise<void> => {
  try {
    const database = await openDatabase();

    // USERS 
    await database.execute(`
      CREATE TABLE IF NOT EXISTS users (
        firebaseUid TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        fullName TEXT NOT NULL,
        phone TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      );
    `);

    // EXPENSES 
    await database.execute(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        imageUrl TEXT,
        type TEXT DEFAULT 'manual',
        FOREIGN KEY (userId) REFERENCES users(firebaseUid) ON DELETE CASCADE
      );
    `);

    console.log('✅ Tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

// Clean Tables
export const dropTables = async (): Promise<void> => {
  try {
    const database = await openDatabase();
    await database.execute('DROP TABLE IF EXISTS expenses');
    await database.execute('DROP TABLE IF EXISTS users');
    console.log('✅ Tables dropped successfully');
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
    throw error;
  }
};


export const resetDatabase = async (): Promise<void> => {
  await dropTables();
  await createTables();
};

// ================== USER CRUD FUNCTIONS ==================

// Create user after Sign up
export const createUser = async (
  firebaseUid: string,
  email: string,
  fullName: string,
  phone: string
): Promise<void> => {
  try {
    const database = await openDatabase();
    const createdAt = Date.now();

    await database.execute(
      `INSERT INTO users (firebaseUid, email, fullName, phone, createdAt) 
       VALUES (?, ?, ?, ?, ?)`,
      [firebaseUid, email, fullName, phone, createdAt]
    );

    console.log('✅ User created in SQLite:', firebaseUid);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
};


export const getUserByFirebaseUid = async (firebaseUid: string): Promise<User | null> => {
  try {
    const database = await openDatabase();

    const result = await database.execute(
      `SELECT * FROM users WHERE firebaseUid = ?`,
      [firebaseUid]
    );

    if (result.rows && result.rows.length > 0) {
      console.log('✅ User found:', result.rows[0].fullName);
      return result.rows[0];
    } else {
      console.log('⚠️ User not found in database');
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    throw error;
  }
};


export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const database = await openDatabase();

    const result = await database.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    return result.rows?.[0] || null;
  } catch (error) {
    console.error('❌ Error fetching user by email:', error);
    throw error;
  }
};


export const updateUser = async (
  firebaseUid: string,
  updates: {
    fullName?: string;
    phone?: string;
  }
): Promise<void> => {
  try {
    const database = await openDatabase();

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.fullName !== undefined) {
      fields.push('fullName = ?');
      values.push(updates.fullName);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updates.phone);
    }

    if (fields.length === 0) {
      console.warn('⚠️ No fields to update');
      return;
    }

    values.push(firebaseUid);

    await database.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE firebaseUid = ?`,
      values
    );

    console.log('✅ User updated:', firebaseUid);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (firebaseUid: string): Promise<void> => {
  try {
    const database = await openDatabase();

    // ON DELETE CASCADE 
    await database.execute(
      `DELETE FROM users WHERE firebaseUid = ?`,
      [firebaseUid]
    );

    console.log('✅ User deleted:', firebaseUid);
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  }
};

// ================== EXPENSE CRUD FUNCTIONS ==================


export const addExpense = async (
  userId: string, // firebaseUid
  amount: number,
  category: string,
  date: number,
  imageUrl?: string,
  type: string = 'manual'
): Promise<number> => {
  try {
    const database = await openDatabase();
    const createdAt = Date.now();

    const insertResult = await database.execute(
      `INSERT INTO expenses (userId, amount, category, date, createdAt, imageUrl, type) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, amount, category, date, createdAt, imageUrl || null, type]
    );

    return insertResult.insertId || 0;
  } catch (error) {
    console.error('❌ Error adding expense:', error);
    throw error;
  }
};


export const getExpenses = async (userId: string): Promise<Expense[]> => {
  try {
    const database = await openDatabase();

    const result = await database.execute(
      `SELECT * FROM expenses WHERE userId = ? ORDER BY date DESC`,
      [userId]
    );

    return result.rows || [];
  } catch (error) {
    console.error('❌ Error fetching expenses:', error);
    throw error;
  }
};


export const getExpenseById = async (id: number): Promise<Expense | null> => {
  try {
    const database = await openDatabase();

    const result = await database.execute(
      `SELECT * FROM expenses WHERE id = ?`,
      [id]
    );

    return result.rows?.[0] || null;
  } catch (error) {
    console.error('❌ Error fetching expense by ID:', error);
    throw error;
  }
};


export const updateExpense = async (
  id: number,
  amount: number,
  category: string,
  date: number,
  imageUrl?: string
): Promise<void> => {
  try {
    const database = await openDatabase();

    await database.execute(
      `UPDATE expenses 
       SET amount = ?, category = ?, date = ?, imageUrl = ? 
       WHERE id = ?`,
      [amount, category, date, imageUrl || null, id]
    );
  } catch (error) {
    console.error('❌ Error updating expense:', error);
    throw error;
  }
};


export const deleteExpense = async (id: number): Promise<void> => {
  try {
    const database = await openDatabase();

    await database.execute(
      `DELETE FROM expenses WHERE id = ?`,
      [id]
    );
  } catch (error) {
    console.error('❌ Error deleting expense:', error);
    throw error;
  }
};


export const getTotalExpenses = async (
  userId: string,
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
): Promise<number> => {
  try {
    const database = await openDatabase();
    const now = Date.now();
    let startTime = 0;

    switch (period) {
      case 'daily':
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case 'weekly':
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case 'monthly':
        startTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case 'yearly':
        startTime = now - 365 * 24 * 60 * 60 * 1000;
        break;
    }

    const result = await database.execute(
      `SELECT SUM(amount) as total 
       FROM expenses 
       WHERE userId = ? AND date >= ?`,
      [userId, startTime]
    );

    return result.rows?.[0]?.total || 0;
  } catch (error) {
    console.error('❌ Error calculating total expenses:', error);
    throw error;
  }
};


export const getExpensesByPeriod = async (
  userId: string,
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
): Promise<Expense[]> => {
  try {
    const database = await openDatabase();
    const now = Date.now();
    let startTime = 0;

    switch (period) {
      case 'daily':
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case 'weekly':
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case 'monthly':
        startTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case 'yearly':
        startTime = now - 365 * 24 * 60 * 60 * 1000;
        break;
    }

    const result = await database.execute(
      `SELECT * FROM expenses 
       WHERE userId = ? AND date >= ? 
       ORDER BY date DESC`,
      [userId, startTime]
    );

    return result.rows || [];
  } catch (error) {
    console.error('❌ Error fetching expenses by period:', error);
    throw error;
  }
};


export const getExpensesByCategory = async (
  userId: string,
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
): Promise<{ category: string; amount: number; percentage: number }[]> => {
  try {
    const expenses = await getExpensesByPeriod(userId, period);
    const total = expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0);

    if (total === 0) return [];

    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach((expense: Expense) => {
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
  } catch (error) {
    console.error('❌ Error getting expenses by category:', error);
    throw error;
  }
};

// ================== EXPORT ==================

export default {
  // Database setup
  openDatabase,
  closeDatabase,
  createTables,
  dropTables,
  resetDatabase,
  
  // User functions
  createUser,
  getUserByFirebaseUid,
  getUserByEmail,
  updateUser,
  deleteUser,
  
  // Expense functions
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getTotalExpenses,
  getExpensesByPeriod,
  getExpensesByCategory,
};

export const getUser = getUserByFirebaseUid;