import PATH from '../config/path.config.js'
import TrackModel from '../models/Track.js'

export const create = async (req, res) => {
	try {
		const imageUrl = req.body.imageUrl || PATH.DEFAULT_IMG.TRACK

		const doc = new TrackModel({
			name: req.body.name,
			artist: req.body.artist,
			src: req.body.src,
      duration: req.body.duration,
			imageUrl,
		})

		const track = await doc.save()

		res.json(track)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось загрузить трек',
		})
	}
}

export const getAll = async (req, res) => {
  try {
    const { order, orderDir, limit, artist, filter } = req.query

    const orderQuery = order
      ? {
          [order]: orderDir === 'asc' ? 1 : -1,
        }
      : null
    const artistQuery = artist ? {
      artist: { $regex: artist, $options: 'i' }
    } : {}
    const filterQuery = filter ? {
      $or: [
        { name: { $regex: filter, $options: 'i' } },
        { artist: { $regex: filter, $options: 'i' } }
      ]
    } : {}

    const tracks = await TrackModel.find({ ...artistQuery, ...filterQuery })
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
		const trackId = req.params.id

		const track = await TrackModel.findOne({
			_id: trackId,
		})

		res.json(track)
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const trackId = req.params.id

		TrackModel.findOneAndDelete({
			_id: trackId,
		})
			.then(doc => {
				if (!doc) {
					return res.status(404).json({
						message: 'Трек не найден',
					})
				}
				res.json({
					success: true,
				})
			})
			.catch(err => {
				console.log(err)
				return res.status(500).json({
					message: 'Не удалось удалить трек',
				})
			})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось удалить трек',
		})
	}
}

export const update = async (req, res) => {
	try {
		const trackId = req.params.id
		await TrackModel.updateOne(
			{
				_id: trackId,
			},
			{
				name: req.body.name,
				artist: req.body.artist,
				imageUrl: req.body.imageUrl,
			}
		).catch(err => {
			console.log(err)
			return res.status(500).json({
				message: 'Не удалось обновить трек',
			})
		})

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
