import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('contractor_app.db');

export const initDB = async () => {
  // Create Jobs Table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      title TEXT,
      description TEXT,
      budget TEXT,
      city TEXT,
      status TEXT,
      sync_status TEXT
    );
  `);

  // Create Notes Table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      job_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      text TEXT,
      sync_status TEXT
    );
  `);

  // Create Sync Queue Table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      type TEXT,
      payload TEXT,
      job_id TEXT,
      uri TEXT
    );
  `);
};

export default db;