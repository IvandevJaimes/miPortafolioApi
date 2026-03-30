import mysql from 'mysql2/promise';
import { config } from '../config/index';

export const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log('[DB] Conexión exitosa');
    conn.release();
  })
  .catch((err: unknown) => {
    const error = err as Error;
    console.error('[DB] Error de conexión:', error.message);
  });
