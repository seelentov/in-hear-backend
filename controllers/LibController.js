import LibModel from '../models/Lib.js'
import TrackModel from '../models/Track.js'

import ArtistModel from '../models/Artist.js'
import PlaylistModel from '../models/Playlist.js'

export const getMyLib = async (req, res) => {
	try {
		const userId = req.userId

		const lib = await LibModel.findOne({
			userId,
		})
			.populate('tracks')
			.populate('playlists')
			.populate('artists')
			.exec()

		res.json(lib)
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'Не удалось получить коллекцию',
		})
	}
}

export const update = async (req, res) => {
  try {
    const userId = req.userId
    const { action } = req.query

    const tracks = req.body.tracks
    const playlists = req.body.playlists
    const artists = req.body.artists

    const updateQuery = {}

    if (action === 'del') {
      updateQuery.$pull = {}
      if (tracks) {
        updateQuery.$pull.tracks = { $in: tracks }
        await TrackModel.updateMany(
          { _id: { $in: tracks } },
          { $inc: { likes: -1 } }
        )
      }

      if (artists) {
        updateQuery.$pull.artists = { $in: artists }
        await ArtistModel.updateMany(
          { _id: { $in: artists } },
          { $inc: { likes: -1 } }
        )
      }

      if (playlists) {
        updateQuery.$pull.playlists = { $in: playlists }
        await PlaylistModel.updateMany(
          { _id: { $in: playlists } },
          { $inc: { likes: -1 } }
        )
      }
    } else {
      updateQuery.$push = {}
      if (tracks) {
        updateQuery.$push.tracks = { $each: tracks, $position: 0 } 
        await TrackModel.updateMany(
          { _id: { $in: tracks } },
          { $inc: { likes: 1 } }
        )
      }

      if (artists) {
        updateQuery.$push.artists = { $each: artists, $position: 0 } 
        await ArtistModel.updateMany(
          { _id: { $in: artists } },
          { $inc: { likes: 1 } }
        )
      }

      if (playlists) {
        updateQuery.$push.playlists = { $each: playlists, $position: 0 } 
        await PlaylistModel.updateMany(
          { _id: { $in: playlists } },
          { $inc: { likes: 1 } }
        )
      }
    }

    await LibModel.updateOne({ userId }, updateQuery)

    return res.json({
      success: true,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'Ошибка',
    })
  }
}
