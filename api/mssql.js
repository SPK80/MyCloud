import sql from 'msnodesqlv8';
import config from './config.js';

const connectionString = `server=${config.server};Database=${config.database};Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}`;

// const query = "SELECT * FROM records, users WHERE records.author_id=users.id";

export function query(sqlQuery) {
	return new Promise((resolve, reject) => {
		sql.query(connectionString, sqlQuery, (err, rows) => {
			if (err) reject(err);
			if (rows) resolve(rows);
		})
	});
}