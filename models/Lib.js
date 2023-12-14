import mongoose from 'mongoose'

const LibSchema = new mongoose.Schema(
	{
		tracks: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Track',
		},
		playlists: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Playlist',
		},
		artists: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Artist',
		},
		userId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('Lib', LibSchema)


/**
playlists: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Playlist',
		},
		artists: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Artist',
		},
     */