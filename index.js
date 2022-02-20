process.env.NODE_ENV = 'development'

import express, { json, urlencoded } from 'express'
import { readFile, writeFile } from 'fs'

const host = 'localhost'
const port = 8000

const app = express()
app.use(json())
app.use(urlencoded({ extended: true }))

let file = 'data.json'

if ((process.env.NODE_ENV = 'test')) file = 'data-test.json'

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

app
	.route('/api/records')
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

			req.records[req.body.record.id] = req.body.record

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

			req.records[req.body.record.id] = req.body.record

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
		if (req.query.id) {
			if (req.records.hasOwnProperty(req.query.id)) {
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
			} else
				return res
					.status(404)
					.send({ message: 'Record not found.' })
		} else
			return res
				.status(400)
				.send({ message: 'Bad request.' })
	})

app.listen(port, host, () =>
	console.log(`Server listens http://${host}:${port}`)
)