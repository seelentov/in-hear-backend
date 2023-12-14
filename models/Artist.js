import mongoose from 'mongoose'

const ArtistSchema = new mongoose.Schema(
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
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('Artist', ArtistSchema)
