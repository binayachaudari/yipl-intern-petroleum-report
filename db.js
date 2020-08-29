const sqlite = require('sqlite3').verbose();

/**
 * Initialize Database
 */
const db = new sqlite.Database('./products.db', err => {
  if (err) return console.error('Error Occured', err);

  console.log('Connected to in-memory DB');
});

/**
 * Creates table
 * @param {String} tableName Table name
 * @param {String} columns Columns of table
 */
exports.createTable = (tableName, columns) => {
  console.log('Creating Table');
  return new Promise((resolve, reject) => {
    db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`, err => {
      if (err) reject(err);
    });
  });
};

/**
 * Inserts data into table
 * @param {String} tableName Table name
 * @param {String} columns Columns of table
 * @param {String} values Values for table
 */
exports.createRow = (tableName, columns, values) => {
  const query = `INSERT INTO ${tableName} (${columns}) VALUES(${values})`;

  return new Promise((resolve, reject) => {
    db.run(query, err => {
      if (err) return reject(err);
    });
  });
};

/**
 * Gets data from database
 * @param {String} tableName Table Name
 * @param {String} selectParams Selection Params
 * @param {String} conditions Conditions for SQL Query
 */
exports.showData = (tableName, selectParams = '*', conditions) => {
  console.log('Data from database');

  return new Promise((resolve, reject) => {
    let query;
    if (conditions) {
      query = `SELECT * FROM ${tableName} WHERE ${conditions}`;
    } else {
      query = `SELECT ${selectParams} FROM ${tableName}`;
    }

    db.all(query, (err, results) => {
      if (err) return reject(err);

      return resolve(results);
    });
  });
};

/**
 * Close Database Connection
 */
exports.closeConnection = () => {
  db.close(err => {
    if (err) return console.error('Error Occured', err);

    console.log('DB Closed!');
  });
};
