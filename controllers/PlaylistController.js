import { validationResult } from 'express-validator'
import PATH from '../config/path.config.js'
import PlaylistModel from '../models/Playlist.js'

export const create = async (req, res) => {
	try {
		const imageUrl = req.body.imageUrl || PATH.DEFAULT_IMG.TRACK

		const doc = new PlaylistModel({
			name: req.body.name,
			author: req.userId,
			desc: req.body.desc,
			imageUrl,
			tracks: req.body.tracks,
      likes: 1 
		})

		const playlist = await doc.save()

		res.json(playlist)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось создать плейлист',
		})
	}
}

export const getAll = async (req, res) => {
  try {
    const { order, orderDir, limit, filter } = req.query

    const orderQuery = order
      ? {
          [order]: orderDir === 'asc' ? 1 : -1,
        }
      : null
    const filterQuery = filter ? {
      name: { $regex: filter, $options: 'i' }
    } : {}

    const tracks = await PlaylistModel.find(filterQuery)
      .sort(orderQuery)
      .limit(limit)

    res.json(tracks)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось получить треки',
    })
  }
}

export const getOne = async (req, res) => {
	try {
		const playlistId = req.params.id

		const playlist = await PlaylistModel.findOne({
			_id: playlistId,
		})
			.populate('tracks')
			.populate(({ path: "author", select: ["login", "avatarUrl"] }))
			.exec()

		res.json(playlist)
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'Не удалось получить плейлист',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const playlistId = req.params.id

		PlaylistModel.findOneAndDelete({
			_id: playlistId,
		})
			.then(doc => {
				if (!doc) {
					return res.status(404).json({
						message: 'Плейлист не найден',
					})
				}
				res.json({
					success: true,
				})
			})
			.catch(err => {
				console.log(err)
				return res.status(500).json({
					message: 'Не удалось удалить плейлист',
				})
			})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось удалить плейлист',
		})
	}
}

export const update = async (req, res) => {
	try {
		const { action } = req.query
		const playlistId = req.params.id

		let query

		if (action === 'tracks') {
			query = {
				$push: { tracks: { $each: req.body.tracks, $position: 0 } },
			}
		} else if (action === 'tracksDel') {
			query = {
				$pull: { tracks: { $in: req.body.tracks } },
			}
		} else {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json(errors.array())
			}
			query = {
				name: req.body.name,
				desc: req.body.desc,
				imageUrl: req.body.imageUrl,
        tracks: req.body.tracks
      }
		}

		await PlaylistModel.updateOne(
			{
				_id: playlistId,
			},
			query
		)

		res.json({
			success: true,
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'Ошибка',
		})
	}
}
