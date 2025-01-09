
 import mariadb from 'mariadb';
 import * as dotenv from 'dotenv';
 
 dotenv.config(); // Charger .env
 
 // Création d'un pool de connexions
 const pool = mariadb.createPool({
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME
 });
 
 /**
  * Petite fonction utilitaire pour exécuter une requête SQL
  * @param {string} sql - La requête SQL
  * @param {Array} params - Les paramètres à binder
  * @returns {Promise<any>} - Le résultat de la requête
  */
 export async function query(sql, params = []) {
   let conn;
   try {
     // Obtenir une connexion
     conn = await pool.getConnection();
     // Exécuter la requête
     const rows = await conn.query(sql, params);
     return rows;
   } catch (err) {
     throw err;
   } finally {
     if (conn) conn.release(); // Libérer la connexion au pool
   }
 }
 