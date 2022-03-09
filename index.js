import express, { json, urlencoded } from 'express'
import favicon from 'express-favicon'
import { readFile, writeFile } from 'fs'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000

const app = express()
app.use(favicon(path.resolve(__dirname, 'favicon.ico')));
app.use(express.static('static'));
app.use(cors());
app.use(json())
app.use(urlencoded({ extended: true }))

let file = path.resolve(__dirname, 'data.json');

if ((process.env.NODE_ENV = 'test'))
	file = path.resolve(__dirname, 'data-test.json');

app.use((req, res, next) => {
	readFile(file, (err, data) => {
		if (err)
			return res
				.status(500)
				.send({ message: 'Error while getting records' })

		req.records = JSON.parse(data)

		next()
	})
})

app.route('/api/records')
	.get((req, res) => {
		if (req.query.id) {
			if (req.records.hasOwnProperty(req.query.id))
				return res
					.status(200)
					.send({ data: req.records[req.query.id] })
			else
				return res
					.status(404)
					.send({ message: 'Record not found.' })
		} else if (!req.records)
			return res
				.status(404)
				.send({ message: 'Records not found.' })

		return res.status(200).send({ data: req.records })
	})
	.post((req, res) => {
		if (req.body.record && req.body.record.id) {
			if (req.records.hasOwnProperty(req.body.record.id))
				return res
					.status(409)
					.send({ message: 'Record already exists.' })

			req.records[req.body.record.id] = req.body.record.text

			writeFile(
				file,
				JSON.stringify(req.records),
				(err, response) => {
					if (err)
						return res
							.status(500)
							.send({ message: 'Unable create record.' })

					return res
						.status(200)
						.send({ message: 'Record created.' })
				}
			)
		} else
			return res
				.status(400)
				.send({ message: 'Bad request.' })
	})
	.put((req, res) => {
		if (req.body.record && req.body.record.id) {
			if (!req.records.hasOwnProperty(req.body.record.id))
				return res
					.status(404)
					.send({ message: 'Record not found.' })

			req.records[req.body.record.id] = req.body.record.text

			writeFile(
				file,
				JSON.stringify(req.records),
				(err, response) => {
					if (err)
						return res
							.status(500)
							.send({ message: 'Unable update record.' })

					return res
						.status(200)
						.send({ message: 'Record updated.' })
				}
			)
		} else
			return res
				.status(400)
				.send({ message: 'Bad request.' })
	})
	.delete((req, res) => {
		// console.log('delete:', req.query);
		if (!req.query?.id) {
			return res
				.status(400)
				.send({ message: 'Bad request.' })
		}

		if (!req.records.hasOwnProperty(req.query.id)) {
			return res
				.status(404)
				.send({ message: 'Record not found.' })
		}

		delete req.records[req.query.id]

		writeFile(
			file,
			JSON.stringify(req.records),
			(err, response) => {
				if (err)
					return res
						.status(500)
						.send({ message: 'Unable delete record.' })

				return res
					.status(200)
					.send({ message: 'Record deleted.' })
			}
		)
	})

app.listen(PORT, () => {
	console.log(`Server listens port:${PORT}`);
	// console.log(__dirname);
})