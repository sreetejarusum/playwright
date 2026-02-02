import mysql from 'mysql2/promise';

export function createMySQLPool(config: mysql.PoolOptions) {
  return mysql.createPool(config);
}
