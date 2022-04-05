import { query } from "./mssql.js"

export async function get() {
	try {
		const records = await query(`
SELECT records.id, records.caption, records.filling, records.changed, users.name
FROM records, users
WHERE records.author_id=users.id
		`);
		if (!records) throw ('Error get records!')
		return records;
	} catch (error) {
		console.error(error);
	}
}

export async function add(record) {
	try {
		const response = await query(`INSERT INTO records (caption, filling, author_id)
VALUES ('${record.caption}', '${record.filling}', (SELECT id FROM users WHERE name='${record.author}'))`);

		if (!response) throw ('Error get records!')
		return response;
	} catch (error) {
		console.error(error);
	}
}

export function del(id) {

}

export function update(id, record) {

}


//tests add get/////////////////////////////////////
(async () => {
	console.log(await add({
		caption: 'caption3',
		filling: 'filling3',
		author: 'quest',
	}));

	const recs = await get();
	console.log(recs);
})()