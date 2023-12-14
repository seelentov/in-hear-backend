import mongoose from 'mongoose'

const PlaylistSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		likes: {
			type: Number,
		},
		desc: {
      type: String,
    },
    imageUrl: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tracks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Track',
    }
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('Playlist', PlaylistSchema)
