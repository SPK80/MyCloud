// import cors from 'cors'
import express from 'express'
import { writeFile } from 'fs'

export function records() {
	const router = express.Router();
	return router.route('/records')
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
}