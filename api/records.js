import { query } from "./mssql.js"

export async function get() {
	try {
		const records = await query(`SELECT * FROM records`);
		if (!records) throw ('Error get records!')
		return records;
	} catch (error) {
		console.error(error);
	}
}

export function add(record) {

}

export function del(id) {

}

export function update(id, record) {

}