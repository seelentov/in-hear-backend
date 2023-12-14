import PATH from '../config/path.config.js'
import ArtistModel from '../models/Artist.js'

export const create = async (req, res) => {
	try {
		const imageUrl = req.body.imageUrl || PATH.DEFAULT_IMG.TRACK

		const doc = new ArtistModel({
			name: req.body.name,
			desc: req.body.desc,
			imageUrl,
		})

		const artist = await doc.save()

		res.json(artist)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось создать страницу исполнителя',
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

    const artists = await ArtistModel.find(filterQuery)
      .sort(orderQuery)
      .limit(limit)

    res.json(artists)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось получить исполнителей',
    })
  }
}

export const getOne = async (req, res) => {
	const artistId = req.params.id

	try {
		const playlist = await ArtistModel.findOne({
			_id: artistId,
		})

		res.json(playlist)
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'Не удалось получить исполнителя',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const artistId = req.params.id

		ArtistModel.findOneAndDelete({
			_id: artistId,
		})
			.then(doc => {
				if (!doc) {
					return res.status(404).json({
						message: 'Исполнитель не найден',
					})
				}
				res.json({
					success: true,
				})
			})
			.catch(err => {
				console.log(err)
				return res.status(500).json({
					message: 'Не удалось удалить исполнителя',
				})
			})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось удалить исполнителя',
		})
	}
}

export const update = async (req, res) => {
	try {
		const artistId = req.params.id

		const query = {
			name: req.body.name,
			desc: req.body.desc,
			imageUrl: req.body.imageUrl,
		}

		await ArtistModel.updateOne(
			{
				_id: artistId,
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
